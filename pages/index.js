import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  padding: 4rem;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #fff;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
`;

const Section = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  margin-bottom: 3rem;
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  margin-bottom: 2rem;
  color: #444;
  border-bottom: 0.2rem solid #eee;
  padding-bottom: 1rem;
`;

const Button = styled.button`
  background: ${props => {
    if (props.disabled) return '#ccc';
    if (props.$variant === 'danger') return '#ff4757';
    if (props.$variant === 'success') return '#2ed573';
    return '#3742fa';
  }};
  color: white;
  border: none;
  padding: 1.5rem 3rem;
  font-size: 1.6rem;
  border-radius: 0.8rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-right: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: ${props => props.disabled ? 1 : 0.9};
    transform: ${props => props.disabled ? 'none' : 'translateY(-0.2rem)'};
  }
`;

const ProgressContainer = styled.div`
  margin: 2rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 3rem;
  background: #f1f2f6;
  border-radius: 1.5rem;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3742fa, #2ed573);
  border-radius: 1.5rem;
  width: ${props => props.$progress}%;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-weight: bold;
  font-size: 1.4rem;
`;

const StatusDisplay = styled.div`
  background: #f8f9fa;
  border: 0.1rem solid #dee2e6;
  border-radius: 0.5rem;
  padding: 2rem;
  margin: 2rem 0;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  max-height: 40rem;
  overflow-y: auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: ${props => props.$bg || '#f8f9fa'};
  padding: 2rem;
  border-radius: 0.8rem;
  text-align: center;
  border: 0.1rem solid #dee2e6;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${props => props.color || '#333'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.4rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
`;

const AudioTestSection = styled.div`
  border-top: 0.1rem solid #eee;
  padding-top: 2rem;
  margin-top: 2rem;
`;

const AudioControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 1rem 0;
`;

const SyllableInput = styled.input`
  padding: 1rem 1.5rem;
  font-size: 1.6rem;
  border: 0.1rem solid #ddd;
  border-radius: 0.5rem;
  width: 20rem;
`;

export default function TTSGenerator() {
  const [progress, setProgress] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState('');
  const [currentBatch, setCurrentBatch] = useState(0);
  const [testSyllable, setTestSyllable] = useState('안');
  const intervalRef = useRef(null);
  const NEW_TOTAL_SYLLABLES = 19 * 21 * 17; // 6783

  // Load initial progress
  useEffect(() => {
    loadProgress();
  }, []);

  // Set up progress monitoring during generation
  useEffect(() => {
    if (isGenerating) {
      intervalRef.current = setInterval(loadProgress, 2000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGenerating]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => `[${timestamp}] ${message}\n${prev}`);
  };

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-progress' })
      });
      
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
      addLog(`진행상황 로드 실패: ${error.message}`);
    }
  };

  const startGeneration = async () => {
    setIsGenerating(true);
    setCurrentBatch(0);
    addLog('한글 음절 TTS 생성 시작...');
    addLog(`총 ${progress?.total || NEW_TOTAL_SYLLABLES}개 음절 처리 예정 (겹받침 제외)`);

    await processNextBatch(0);
  };

  const processNextBatch = async (startIndex) => {
    try {
      addLog(`배치 처리 중... (시작: ${startIndex})`);
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'generate-all', 
          startIndex,
          batchSize: 50 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCurrentBatch(prev => prev + 1);
        addLog(`배치 완료: ${data.processed}개 처리, ${data.errors}개 오류`);
        
        if (data.errors > 0) {
          addLog(`오류 샘플: ${data.errors.slice(0, 3).map(e => e.syllable).join(', ')}`);
        }
        
        if (!data.isComplete && data.nextStartIndex !== null) {
          // 다음 배치 처리
          setTimeout(() => processNextBatch(data.nextStartIndex), 1000);
        } else {
          addLog('모든 음절 처리 완료!');
          if (data.indexGenerated) {
            addLog('인덱스 파일 생성 완료: /public/audio/index.json');
          }
          setIsGenerating(false);
        }
      } else {
        throw new Error(data.error || '알 수 없는 오류');
      }
    } catch (error) {
      console.error('Batch processing failed:', error);
      addLog(`배치 처리 실패: ${error.message}`);
      setIsGenerating(false);
    }
  };

  const stopGeneration = () => {
    setIsGenerating(false);
    addLog('생성 중단됨');
  };

  const clearLogs = () => {
    setLogs('');
  };

  const testAudio = async () => {
    if (!testSyllable.trim()) return;
    
    try {
      addLog(`테스트 음절 재생: ${testSyllable}`);
      
      // 로컬 파일에서 먼저 찾기
      const response = await fetch(`/audio/${testSyllable[0]}/${testSyllable}_test.mp3`);
      
      if (response.ok) {
        const audio = new Audio(response.url);
        audio.play();
        addLog(`로컬 파일에서 재생: ${testSyllable}`);
      } else {
        addLog(`로컬 파일 없음, OpenAI TTS로 실시간 생성...`);
        
        // 실시간 TTS 생성 (테스트용)
        const ttsResponse = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'generate-single',
            syllable: testSyllable
          })
        });
        
        if (ttsResponse.ok) {
          const blob = await ttsResponse.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.play();
          addLog(`실시간 TTS 재생 완료: ${testSyllable}`);
        }
      }
    } catch (error) {
      addLog(`오디오 테스트 실패: ${error.message}`);
    }
  };

  const downloadIndex = async () => {
    try {
      const response = await fetch('/audio/index.json');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hangeul-syllables-index.json';
        a.click();
        URL.revokeObjectURL(url);
        addLog('인덱스 파일 다운로드 완료');
      } else {
        addLog('인덱스 파일을 찾을 수 없습니다');
      }
    } catch (error) {
      addLog(`인덱스 파일 다운로드 실패: ${error.message}`);
    }
  };

  return (
    <Container>
      <Title>한글 음절 TTS 생성기</Title>
      
      <Section>
        <SectionTitle>📊 현재 상태</SectionTitle>
        
        <StatsGrid>
          <StatCard $bg="#e8f5e8">
            <StatNumber color="#2ed573">{progress?.completed || 0}</StatNumber>
            <StatLabel>완료된 음절</StatLabel>
          </StatCard>
          
          <StatCard $bg="#fff3e0">
            <StatNumber color="#ff9f43">{progress?.remaining || 0}</StatNumber>
            <StatLabel>남은 음절</StatLabel>
          </StatCard>
          
          <StatCard $bg="#e8f4fd">
            <StatNumber color="#3742fa">{progress?.total || NEW_TOTAL_SYLLABLES}</StatNumber>
            <StatLabel>전체 음절 (겹받침 제외)</StatLabel>
          </StatCard>
          
          <StatCard $bg="#f8f9fa"> 
            <StatNumber color="#333">{progress?.progress || 0}%</StatNumber>
            <StatLabel>진행률</StatLabel>
          </StatCard>
        </StatsGrid>

        {progress && (
          <ProgressContainer>
            <ProgressBar>
              <ProgressFill $progress={progress.progress} />
              <ProgressText>{progress.progress}% ({progress.completed}/{progress.total || NEW_TOTAL_SYLLABLES})</ProgressText>
            </ProgressBar>
          </ProgressContainer>
        )}
      </Section>

      <Section>
        <SectionTitle>🎵 TTS 생성 제어</SectionTitle>
        
        <div>
          <Button 
            onClick={startGeneration} 
            disabled={isGenerating}
            $variant="success"
          >
            {isGenerating ? `생성 중... (배치 ${currentBatch})` : '전체 음절 TTS 생성 시작'}
          </Button>
          
          <Button 
            onClick={stopGeneration} 
            disabled={!isGenerating}
            $variant="danger"
          >
            생성 중단
          </Button>
          
          <Button onClick={loadProgress}>
            진행상황 새로고침
          </Button>
          
          <Button onClick={downloadIndex}>
            인덱스 파일 다운로드
          </Button>
        </div>

        <p style={{ marginTop: '2rem', color: '#666', fontSize: '1.4rem' }}>
          ⚠️ 전체 생성에는 약 1.5-2시간이 소요될 수 있습니다. (${NEW_TOTAL_SYLLABLES}개 음절 - 겹받침 제외)<br/>
          💡 배치 처리로 안정적으로 진행되며, 중간에 중단해도 이어서 진행 가능합니다.<br/>
          🎤 OpenAI gpt-4o-mini-tts 모델로 고품질 한국어 발음 생성
        </p>
      </Section>

      <Section>
        <SectionTitle>🔊 오디오 테스트</SectionTitle>
        
        <AudioControls>
          <SyllableInput
            value={testSyllable}
            onChange={(e) => setTestSyllable(e.target.value)}
            placeholder="테스트할 음절 입력"
            maxLength="1"
          />
          <Button onClick={testAudio}>
            음절 재생 테스트
          </Button>
        </AudioControls>
        
        <p style={{ color: '#666', fontSize: '1.3rem' }}>
          생성된 음절 파일이 있으면 로컬에서 재생, 없으면 실시간 TTS로 테스트합니다.
        </p>
      </Section>

      <Section>
        <SectionTitle>📝 로그</SectionTitle>
        
        <div>
          <Button onClick={clearLogs} $variant="secondary">
            로그 지우기
          </Button>
        </div>
        
        <StatusDisplay>{logs || '로그가 없습니다...'}</StatusDisplay>
      </Section>
    </Container>
  );
} 