import axios from "axios";
import fs from "fs";
import path from "path";

// Korean syllable generation constants (from hangeul hook)
const INITIAL_CONSONANTS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const MEDIAL_VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
// Use complete final consonants array for Unicode standard (28 positions)
const FINAL_CONSONANTS = ['', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄹ', 'ㄹㄱ', 'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

const HANGEUL_OFFSET = 0xAC00; // '가'

// Decompose Korean syllable into jamo components
function decomposeSyllable(syllable) {
  const syllableCode = syllable.charCodeAt(0) - HANGEUL_OFFSET;
  
  const initialIndex = Math.floor(syllableCode / (21 * 28));
  const medialIndex = Math.floor((syllableCode % (21 * 28)) / 28);
  const finalIndex = syllableCode % 28;
  
  return {
    initial: INITIAL_CONSONANTS[initialIndex],
    medial: MEDIAL_VOWELS[medialIndex], 
    final: finalIndex === 0 ? 'none' : FINAL_CONSONANTS[finalIndex]
  };
}

// Generate Korean syllable from jamo components
function composeSyllable(initial, medial, final) {
  const initialIndex = INITIAL_CONSONANTS.indexOf(initial);
  const medialIndex = MEDIAL_VOWELS.indexOf(medial);
  const finalIndex = FINAL_CONSONANTS.indexOf(final);
  
  if (initialIndex === -1 || medialIndex === -1 || finalIndex === -1) {
    return null;
  }
  
  const syllableCode = HANGEUL_OFFSET + (initialIndex * 21 * 28) + (medialIndex * 28) + finalIndex;
  return String.fromCharCode(syllableCode);
}

// Generate all possible Korean syllables
function generateAllSyllables() {
  console.log('[Syllable Gen] Starting generation with complete FINAL_CONSONANTS:', FINAL_CONSONANTS.length, 'elements');
  
  const syllables = [];
  
  // Generate using standard Korean Unicode ranges
  for (let i = 0; i < INITIAL_CONSONANTS.length; i++) {
    for (let j = 0; j < MEDIAL_VOWELS.length; j++) {
      for (let k = 0; k < FINAL_CONSONANTS.length; k++) {
        // Generate syllable using correct Unicode formula
        const syllableCode = HANGEUL_OFFSET + (i * 21 * 28) + (j * 28) + k;
        const syllableChar = String.fromCharCode(syllableCode);
        
        // CRITICAL: Decompose the generated syllable to get actual jamo components
        const decomposed = decomposeSyllable(syllableChar);
        
        // Create filename using the decomposed jamo (this ensures perfect sync)
        const filename = `${decomposed.initial}_${decomposed.medial}_${decomposed.final}.mp3`;
        
        // Create syllable entry with perfectly synchronized data
        const syllableEntry = {
          syllable: syllableChar,  // This goes to TTS
          initial: decomposed.initial,
          medial: decomposed.medial,
          final: decomposed.final,
          filename: filename,
          components: { initial: decomposed.initial, medial: decomposed.medial, final: decomposed.final }
        };
        
        syllables.push(syllableEntry);
      }
    }
  }
  
  console.log(`[Syllable Gen] Generated ${syllables.length} syllables. Example:`, syllables[0]);
  console.log(`[Syllable Gen] Verification - First few syllables:`, 
    syllables.slice(0, 5).map(s => `${s.syllable}(${s.filename})`).join(', '));
  
  // Additional verification for critical syllables
  const criticalCheck = syllables.find(s => s.syllable === '간');
  if (criticalCheck) {
    console.log(`[Syllable Gen] CRITICAL CHECK - '간':`, criticalCheck);
  }
  
  // Double check: verify a few known syllables
  const testSyllables = ['가', '간', '각', '갑'];
  testSyllables.forEach(testSyl => {
    const found = syllables.find(s => s.syllable === testSyl);
    if (found) {
      console.log(`[Syllable Gen] Test verification - '${testSyl}':`, found);
    }
  });
  
  return syllables;
}

// Generate TTS audio using OpenAI API
async function generateTTSAudio(syllable) {
  console.log(`[TTS API Request] Syllable: ${syllable}, Voice: fable`);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        model: "gpt-4o-mini-tts",
        input: syllable,
        voice: "fable", // Changed voice to fable
        response_format: "mp3",
        speed: 1.0,
        instructions: "한국어, 한 음절씩만 줌. 빠르고 명확하고 부드럽게, 아나운서같게, 1초 안에 발음."
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: 'arraybuffer'
      }
    );
    console.log(`[TTS API Response] Syllable: ${syllable}, Status: ${response.status}, Content-Length: ${response.headers['content-length']}`);
    if (response.status !== 200 || !response.data || response.data.length === 0) {
      throw new Error(`Invalid audio data received from OpenAI API. Status: ${response.status}`);
    }
    return Buffer.from(response.data);
  } catch (error) {
    const errorMessage = error.response?.data ? Buffer.from(error.response.data).toString() : error.message;
    console.error(`[TTS API Error] Syllable: ${syllable}, Error: ${errorMessage}`);
    throw new Error(`TTS generation failed for ${syllable}: ${errorMessage}`);
  }
}

// Save audio file to local storage (conservative approach)
async function saveAudioFileConservative(audioBuffer, filename, syllableData) {
  const audioDir = path.join(process.cwd(), 'public', 'audio');
  const initialDir = path.join(audioDir, syllableData.initial);
  const finalFilePath = path.join(initialDir, filename);
  const tempFilePath = path.join(initialDir, `${filename}.tmp`);

  console.log(`[Save Audio] Attempting to save: ${syllableData.syllable} (${filename})`);

  try {
    // Ensure base and initial-specific directories exist
    if (!fs.existsSync(audioDir)) {
      console.log(`[Save Audio] Creating base directory: ${audioDir}`);
      fs.mkdirSync(audioDir, { recursive: true });
    }
    if (!fs.existsSync(initialDir)) {
      console.log(`[Save Audio] Creating initial directory: ${initialDir}`);
      fs.mkdirSync(initialDir, { recursive: true });
    }

    // 1. Write to temporary file
    console.log(`[Save Audio] Writing to temporary file: ${tempFilePath}`);
    fs.writeFileSync(tempFilePath, audioBuffer);

    // 2. Basic validation (file exists and has size > 0)
    const stats = fs.statSync(tempFilePath);
    if (!stats.isFile() || stats.size === 0) {
      throw new Error('Temporary audio file is invalid or empty after writing.');
    }
    console.log(`[Save Audio] Temporary file written successfully: ${tempFilePath}, Size: ${stats.size}`);

    // 3. Rename temporary file to final filename (atomic operation on most systems)
    // If final file exists, backup or remove before renaming
    if (fs.existsSync(finalFilePath)) {
      console.warn(`[Save Audio] Final file exists: ${finalFilePath}. Replacing.`);
      // Optional: Backup logic fs.renameSync(finalFilePath, `${finalFilePath}.bak-${Date.now()}`);
      fs.unlinkSync(finalFilePath); // Remove existing file before rename for atomicity assurance on some systems
    }
    console.log(`[Save Audio] Renaming ${tempFilePath} to ${finalFilePath}`);
    fs.renameSync(tempFilePath, finalFilePath);
    
    console.log(`[Save Audio] Successfully saved: ${finalFilePath}`);
    return {
      path: finalFilePath,
      publicPath: `/audio/${syllableData.initial}/${filename}`,
      syllable: syllableData.syllable,
      components: {
        initial: syllableData.initial,
        medial: syllableData.medial,
        final: syllableData.final
      }
    };

  } catch (saveError) {
    console.error(`[Save Audio Error] Failed to save ${filename} for syllable ${syllableData.syllable}: ${saveError.message}`);
    // Clean up temporary file if it exists on error
    if (fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`[Save Audio Cleanup] Deleted temporary file: ${tempFilePath}`);
      } catch (cleanupError) {
        console.error(`[Save Audio Cleanup Error] Failed to delete temporary file ${tempFilePath}: ${cleanupError.message}`);
      }
    }
    throw saveError; // Re-throw the error to be caught by the batch processor
  }
}

// Generate index file for easy lookup
function generateIndexFile(audioFiles) {
  const indexPath = path.join(process.cwd(), 'public', 'audio', 'index.json');
  
  const index = {
    totalFiles: audioFiles.length,
    generatedAt: new Date().toISOString(),
    syllables: audioFiles.reduce((acc, file) => {
      acc[file.syllable] = {
        publicPath: file.publicPath,
        components: file.components
      };
      return acc;
    }, {}),
    byInitial: audioFiles.reduce((acc, file) => {
      if (!acc[file.components.initial]) {
        acc[file.components.initial] = [];
      }
      acc[file.components.initial].push({
        syllable: file.syllable,
        publicPath: file.publicPath,
        components: file.components
      });
      return acc;
    }, {}),
    byMedial: audioFiles.reduce((acc, file) => {
      if (!acc[file.components.medial]) {
        acc[file.components.medial] = [];
      }
      acc[file.components.medial].push({
        syllable: file.syllable,
        publicPath: file.publicPath,
        components: file.components
      });
      return acc;
    }, {})
  };
  
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  return indexPath;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { action, startIndex = 0, batchSize = 50, syllable } = req.body;
  
  try {
    // CRITICAL: Ensure this is called *once* per API request effectively, 
    // or that its result is memoized if called multiple times within one request flow.
    const allSyllables = generateAllSyllables(); 
    
    switch (action) {
      case 'generate-all': {
        const selectedSyllables = allSyllables.slice(startIndex, startIndex + batchSize);
        const results = [];
        const errors = [];
        let skippedCount = 0;
        
        console.log(`[Batch Process] Starting batch from index ${startIndex}, size ${selectedSyllables.length}`);

        // Check overall progress first
        const audioDir = path.join(process.cwd(), 'public', 'audio');
        let totalCompletedFiles = 0;
        if (fs.existsSync(audioDir)) {
          for (const initial of INITIAL_CONSONANTS) {
            const initialDir = path.join(audioDir, initial);
            if (fs.existsSync(initialDir)) {
              totalCompletedFiles += fs.readdirSync(initialDir).filter(f => f.endsWith('.mp3') && !f.endsWith('.tmp')).length;
            }
          }
        }
        const overallProgress = Math.round((totalCompletedFiles / allSyllables.length) * 100);
        console.log(`[Progress] 전체 진행률: ${overallProgress}% (${totalCompletedFiles}/${allSyllables.length})`);

        for (let i = 0; i < selectedSyllables.length; i++) {
          const syllableData = selectedSyllables[i];
          const initialDir = path.join(audioDir, syllableData.initial);
          const finalFilePath = path.join(initialDir, syllableData.filename);
          
          // Check if file already exists
          if (fs.existsSync(finalFilePath)) {
            skippedCount++;
            console.log(
              `[Skip] 이미 존재하는 파일: '${syllableData.syllable}' → ${syllableData.filename} ` +
              `(${startIndex + i + 1}/${allSyllables.length}) - 건너뛰기`
            );
            continue; // Skip this syllable
          }
          
          // Log the syllable character that will be sent to TTS and the filename it will be saved as
          console.log(
            `[Batch Process] TTS 생성 중: '${syllableData.syllable}' → ${syllableData.filename} ` +
            `(${startIndex + i + 1}/${allSyllables.length}) - ` +
            `Jamo: (${syllableData.initial}, ${syllableData.medial}, ${syllableData.final})`
          );
          
          try {
            // Ensure syllableData.syllable (the actual character) is sent to TTS
            const audioBuffer = await generateTTSAudio(syllableData.syllable);
            const savedFile = await saveAudioFileConservative(audioBuffer, syllableData.filename, syllableData);
            results.push(savedFile);
            await new Promise(resolve => setTimeout(resolve, 100)); 
          } catch (error) {
            console.error(`[Batch Process Error] Failed for syllable char '${syllableData.syllable}', filename ${syllableData.filename}: ${error.message}`);
            errors.push({
              syllable: syllableData.syllable,
              filename: syllableData.filename,
              error: error.message
            });
          }
        }
        
        console.log(`[Batch Process] 배치 완료 - 처리: ${results.length}, 건너뛰기: ${skippedCount}, 오류: ${errors.length}`);
        
        // Update progress after this batch
        let newTotalCompletedFiles = 0;
        if (fs.existsSync(audioDir)) {
          for (const initial of INITIAL_CONSONANTS) {
            const initialDir = path.join(audioDir, initial);
            if (fs.existsSync(initialDir)) {
              newTotalCompletedFiles += fs.readdirSync(initialDir).filter(f => f.endsWith('.mp3') && !f.endsWith('.tmp')).length;
            }
          }
        }
        const newOverallProgress = Math.round((newTotalCompletedFiles / allSyllables.length) * 100);
        console.log(`[Progress] 업데이트된 진행률: ${newOverallProgress}% (${newTotalCompletedFiles}/${allSyllables.length})`);
        
        // Ensure index generation uses the correct allSyllables data
        let indexPath = null;
        if (startIndex + batchSize >= allSyllables.length) {
          console.log('[Index Gen] Last batch completed. Generating/Updating index file.');
          const allGeneratedFiles = [];
          // Re-scan directory to build index from actual files, ensuring consistency
          for (const initial of INITIAL_CONSONANTS) {
            const initialDir = path.join(audioDir, initial);
            if (fs.existsSync(initialDir)) {
              const filesInDir = fs.readdirSync(initialDir);
              for (const file of filesInDir) {
                if (file.endsWith('.mp3') && !file.endsWith('.tmp')) { // Exclude .tmp files
                  // Attempt to match file to syllableData. This can be complex if filenames don't perfectly match
                  // For now, we assume filename structure is ${initial}_${medial}_${final}.mp3
                  const parts = file.replace('.mp3', '').split('_');
                  if (parts.length === 3) {
                    const matchedSyllableData = allSyllables.find(s => s.initial === parts[0] && s.medial === parts[1] && (s.final === parts[2] || (s.final === 'none' && parts[2] === 'none') ) );
                    if (matchedSyllableData) {
                      allGeneratedFiles.push({
                        syllable: matchedSyllableData.syllable,
                        publicPath: `/audio/${initial}/${file}`,
                        components: {
                          initial: matchedSyllableData.initial,
                          medial: matchedSyllableData.medial,
                          final: matchedSyllableData.final
                        }
                      });
                    }
                  } else {
                     console.warn(`[Index Gen] Could not parse syllable components from filename: ${file}`);
                  }
                }
              }
            }
          }
          console.log(`[Index Gen] Found ${allGeneratedFiles.length} MP3 files for indexing.`);
          indexPath = generateIndexFile(allGeneratedFiles);
          console.log(`[Index Gen] Index file generated/updated at: ${indexPath}`);
        }
        
        res.status(200).json({
          success: true,
          processed: results.length,
          skipped: skippedCount,
          errors: errors.length > 0 ? errors : [],
          totalSyllables: allSyllables.length,
          currentBatch: { startIndex, endIndex: startIndex + batchSize, batchSize },
          isComplete: startIndex + batchSize >= allSyllables.length,
          nextStartIndex: startIndex + batchSize < allSyllables.length ? startIndex + batchSize : null,
          indexGenerated: !!indexPath,
          progress: {
            completed: newTotalCompletedFiles,
            total: allSyllables.length,
            percentage: newOverallProgress,
            remaining: Math.max(0, allSyllables.length - newTotalCompletedFiles)
          },
          results: results.slice(0, 5),
          errors: errors.length > 0 ? errors.slice(0, 5) : []
        });
        break;
      }
        
      case 'generate-single': { // This part also needs to use the conservative save if we want consistency, but it's for direct download.
        // For direct download, the current approach is fine. If saving for later use, then conservative is better.
        // Assuming current direct download behavior is acceptable.
        if (!syllable) {
          return res.status(400).json({ error: 'Syllable is required' });
        }
        console.log(`[Single TTS] Request for syllable: ${syllable}`);
        try {
          const audioBuffer = await generateTTSAudio(syllable);
          const encodedSyllable = encodeURIComponent(syllable);
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Length', audioBuffer.length);
          res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedSyllable}_test.mp3`);
          console.log(`[Single TTS] Sending audio for syllable: ${syllable}`);
          return res.send(audioBuffer);
        } catch (error) {
          console.error(`[Single TTS Error] Failed to generate TTS for ${syllable}: ${error.message}`);
          return res.status(500).json({ error: 'Failed to generate TTS', details: error.message });
        }
      }

      case 'get-progress': {
        // ... (get-progress logic remains largely the same, but ensure it counts actual files not based on allSyllables array directly for accuracy)
        const audioDir = path.join(process.cwd(), 'public', 'audio');
        let completedCount = 0;
        if (fs.existsSync(audioDir)) {
          for (const initial of INITIAL_CONSONANTS) {
            const initialDir = path.join(audioDir, initial);
            if (fs.existsSync(initialDir)) {
              completedCount += fs.readdirSync(initialDir).filter(f => f.endsWith('.mp3') && !f.endsWith('.tmp')).length;
            }
          }
        }
        const totalSyllablesToGenerate = allSyllables.length; // This is the target number based on script logic
        console.log(`[Progress Check] Completed MP3 files: ${completedCount}, Target total: ${totalSyllablesToGenerate}`);
        res.status(200).json({
          total: totalSyllablesToGenerate,
          completed: completedCount,
          remaining: Math.max(0, totalSyllablesToGenerate - completedCount), // Ensure remaining is not negative
          progress: totalSyllablesToGenerate > 0 ? Math.round((completedCount / totalSyllablesToGenerate) * 100) : 0
        });
        break;
      }
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error(`[API Handler Error] Action: ${action}, Error: ${error.message}, Stack: ${error.stack}`);
    return res.status(500).json({ error: 'Internal server error', details: error.message, stack: error.stack });
  }
} 