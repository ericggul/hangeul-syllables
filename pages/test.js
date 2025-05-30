import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #fff;
  min-height: 100vh;
  padding: 4rem;
  max-width: 80rem;
  margin: 0 auto;
  font-family: 'Noto Sans KR', Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  margin-bottom: 3rem;
  color: #333;
  text-align: center;
`;

const Section = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  margin-bottom: 3rem;
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);
  border: 0.1rem solid #e9ecef;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  margin-bottom: 2rem;
  color: #444;
  border-bottom: 0.2rem solid #eee;
  padding-bottom: 1rem;
`;

const TestControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const SyllableInput = styled.input`
  padding: 1rem 1.5rem;
  font-size: 1.6rem;
  width: 10rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.5rem;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.4rem;
  background-color: ${props => props.disabled ? '#ccc' : (props.$variant === 'success' ? '#28a745' : '#007bff')};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;

  &:hover {
    opacity: ${props => props.disabled ? 1 : 0.9};
    transform: ${props => props.disabled ? 'none' : 'translateY(-0.2rem)'};
  }
`;

const MessageBox = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  border: 0.1rem solid #dee2e6;
  border-radius: 0.5rem;
  margin-top: 2rem;
  font-size: 1.4rem;
`;

const UsageSection = styled.div`
  font-size: 1.2rem;
  color: #666;
  
  h3 {
    font-size: 1.6rem;
    color: #333;
    margin-bottom: 1rem;
  }
  
  ul {
    padding-left: 2rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
  
  a {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function TestTTSPage() {
  const [testSyllable, setTestSyllable] = useState('안');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testSingleTTS = async () => {
    if (!testSyllable.trim()) return;
    
    setIsLoading(true);
    setMessage('TTS 생성 중...');
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'generate-single',
          syllable: testSyllable
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        
        audio.play();
        setMessage(`✅ 성공: ${testSyllable} 재생됨`);
        
        // Clean up object URL after playing
        audio.onended = () => URL.revokeObjectURL(audioUrl);
      } else {
        const errorData = await response.json();
        setMessage(`❌ 오류: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`❌ 네트워크 오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testProgress = async () => {
    setIsLoading(true);
    setMessage('진행상황 확인 중...');
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-progress' })
      });
      
      const data = await response.json();
      setMessage(`📊 진행상황: ${data.completed}/${data.total} (${data.progress}%)`);
    } catch (error) {
      setMessage(`❌ 오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>한글 TTS API 테스트</Title>
      
      <Section>
        <SectionTitle>🎤 단일 음절 테스트</SectionTitle>
        <TestControls>
          <SyllableInput
            type="text"
            value={testSyllable}
            onChange={(e) => setTestSyllable(e.target.value)}
            placeholder="테스트할 음절"
            maxLength="1"
          />
          <Button
            onClick={testSingleTTS}
            disabled={isLoading}
          >
            {isLoading ? '생성 중...' : 'TTS 테스트'}
          </Button>
        </TestControls>
      </Section>

      <Section>
        <SectionTitle>📊 진행상황 테스트</SectionTitle>
        <Button
          onClick={testProgress}
          disabled={isLoading}
          $variant="success"
        >
          {isLoading ? '확인 중...' : '진행상황 확인'}
        </Button>
      </Section>

      {message && (
        <MessageBox>
          {message}
        </MessageBox>
      )}

      <Section>
        <UsageSection>
          <h3>사용법:</h3>
          <ul>
            <li>단일 음절 테스트: 원하는 한글 음절을 입력하고 "TTS 테스트" 버튼 클릭</li>
            <li>진행상황 확인: 현재 생성된 음절 파일의 진행률 확인</li>
            <li>관리자 페이지: <a href="/">메인 페이지</a>에서 전체 음절 생성</li>
          </ul>
        </UsageSection>
      </Section>
    </Container>
  );
} 