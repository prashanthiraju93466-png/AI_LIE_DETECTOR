import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Activity, Eye, Mic, XCircle, CheckCircle, AlertCircle, Fingerprint, BrainCircuit, Play, Square } from 'lucide-react';
import './index.css';

function App() {
  const [score, setScore] = useState(0);
  const [expressions, setExpressions] = useState(['System Ready. Awaiting start.']);
  const [audioMetrics, setAudioMetrics] = useState({ pitch: '0Hz', jitter: '0%', shimmer: '0%' });
  const [confidence, setConfidence] = useState(0);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState(null);

  // Stop media tracks when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startAnalysis = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data && event.data.size > 0) {
          // --- MOCK DATA SIMULATION (PORTFOLIO MODE) ---
          const mockScore = Math.random() * 100;
          const mockConfidence = Math.floor(Math.random() * 20) + 80; // 80-100%
          
          const mockExpList = [
            'Micro-tension detected in upper lip', 
            'Baseline parameters matched', 
            'Eye blink rate increased', 
            'Smile asymmetry logged',
            'Vocal pitch irregularity',
            'Neutral expression maintained'
          ];
          const newExp = mockExpList[Math.floor(Math.random() * mockExpList.length)];
          
          setScore(mockScore);
          setConfidence(mockConfidence);
          setExpressions(prev => {
            const arr = [newExp, ...prev].slice(0, 5);
            return arr;
          });
          
          setAudioMetrics({
            pitch: Math.floor(Math.random() * 50 + 150) + 'Hz',
            jitter: (Math.random() * 2.5).toFixed(2) + '%',
            shimmer: (Math.random() * 5 + 1).toFixed(2) + '%'
          });
        }
      };

      mediaRecorder.start(2500); // 2.5-second slices
      setIsAnalyzing(true);
      setExpressions(['Baseline Established', 'Awaiting Features...']);

    } catch (err) {
      console.error("Error accessing media: ", err);
      setCameraError(true);
    }
  };

  const stopAnalysis = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsAnalyzing(false);
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
    setScore(0);
    setConfidence(0);
    setExpressions(['Analysis Terminated. System Idle.']);
    setAudioMetrics({ pitch: '0Hz', jitter: '0%', shimmer: '0%' });
  };

  const getVerdict = (s) => {
    if (s === 0) return { label: 'STANDBY', color: 'var(--text-dim)', glow: 'transparent', icon: <Activity size={32} /> };
    if (s < 40) return { label: 'TRUTHFUL', color: 'var(--success)', glow: 'var(--success-glow)', icon: <CheckCircle size={32} /> };
    if (s < 70) return { label: 'INCONCLUSIVE', color: 'var(--warning)', glow: 'var(--warning)', icon: <AlertCircle size={32} /> };
    return { label: 'DECEPTION DETECTED', color: 'var(--danger)', glow: 'var(--danger-glow)', icon: <XCircle size={32} /> };
  };

  const verdict = getVerdict(score);

  return (
    <div className="dashboard-container">
      <header className="glass-panel header">
        <div className="logo">
          <ShieldAlert size={28} className="text-accent" />
          <h1>Nexus <span className="text-accent">AI</span> <span className="text-dim">| Deception Analysis System</span></h1>
        </div>
        <div className="status">
          <span className={`status-indicator ${isAnalyzing ? 'active' : ''}`} style={{ backgroundColor: isAnalyzing ? 'var(--danger)' : 'var(--text-dim)'}}></span>
          {isAnalyzing ? 'Recording & Analyzing' : 'System Idle'}
        </div>
      </header>

      <main className="content-grid">
        <section className="glass-panel video-feed">
          <div className="panel-header">
            <Eye size={20} className="text-accent" />
            <h2>Visual Micro-Expression Analysis</h2>
          </div>
          <div className="panel-content video-content">
            
            <div className="video-scanner-container">
              <div className="video-feed-overlay">
                {cameraError && (
                   <p style={{ position: 'absolute', zIndex: 10, color: 'var(--danger)', top: '10px', left: '10px' }}>
                     Camera/Mic access denied.
                   </p>
                )}
                
                {!isAnalyzing && !cameraError && (
                  <div className="standby-overlay">
                    <button className="start-btn" onClick={startAnalysis}>
                      <Play size={24} /> Initialize Session & Record
                    </button>
                  </div>
                )}

                {isAnalyzing && (
                   <div style={{ position: 'absolute', zIndex: 10, top: '10px', right: '10px' }}>
                     <button className="stop-btn" onClick={stopAnalysis}>
                       <Square size={16} /> Terminate
                     </button>
                   </div>
                )}

                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isAnalyzing ? 0.9 : 0.1 }}
                />
                
                {isAnalyzing && (
                  <>
                    <div className="scan-line"></div>
                    <div className="face-bounding-box">
                      <div className="corner top-left"></div>
                      <div className="corner top-right"></div>
                      <div className="corner bottom-left"></div>
                      <div className="corner bottom-right"></div>
                      <div className="crosshair"></div>
                    </div>
                  </>
                )}
              </div>
              <div className="subject-meta text-dim">
                <span><Fingerprint size={14}/> Subject_ID: 94-Alpha</span>
                <span>FACS Engine: {isAnalyzing ? 'Active' : 'Offline'}</span>
              </div>
            </div>

            <div className="analysis-sidebar">
              <h3>FACS Log</h3>
              <ul className="expression-log">
                {expressions.map((exp, i) => (
                  <li key={i} className={i === 0 && isAnalyzing ? 'highlight-log' : ''}>
                    <ChevronIcon /> {exp}
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </section>

        <section className="glass-panel audio-feed">
          <div className="panel-header">
            <Mic size={20} className="text-accent" />
            <h2>Vocal Characteristics</h2>
          </div>
          <div className="panel-content audio-content">
            
            <div className="waveform-container">
               {isAnalyzing ? (
                 [...Array(24)].map((_, i) => (
                   <div key={i} className="bar" style={{ animationDelay: `${Math.random() * 0.5}s`, height: `${Math.random() * 60 + 20}%`}}></div>
                 ))
               ) : (
                 <div className="text-dim" style={{fontFamily: 'Roboto Mono', fontSize: '0.85rem'}}>Awaiting Audio Signal...</div>
               )}
            </div>

            <div className="metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Pitch (F0)</span>
                <span className="metric-value">{audioMetrics.pitch}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Jitter</span>
                <span className="metric-value">{audioMetrics.jitter}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Shimmer</span>
                <span className="metric-value">{audioMetrics.shimmer}</span>
              </div>
            </div>

          </div>
        </section>

        <section className="glass-panel results-panel">
          <div className="panel-header">
            <Activity size={20} className="text-accent" />
            <h2>Multimodal Synthesis</h2>
          </div>
          <div className="panel-content results-content">
            
            <div className="score-ring-container" style={{ '--score-color': verdict.color, '--score-glow': verdict.glow }}>
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle"
                  strokeDasharray={`${score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="score-text">
                <span className="score-number">{Math.round(score)}<span className="percent">%</span></span>
                <span className="score-label">PROBABILITY</span>
              </div>
            </div>

            <div className="verdict-box" style={{ color: verdict.color, textShadow: `0 0 10px ${verdict.glow}` }}>
               {verdict.icon}
               <div className="verdict-text">{verdict.label}</div>
            </div>
            
            <div className="confidence-meter">
               <div className="confidence-label">
                 <span><BrainCircuit size={14}/> AI Confidence</span>
                 <span>{confidence}%</span>
               </div>
               <div className="confidence-bar-bg">
                 <div className="confidence-bar-fill" style={{width: `${confidence}%`}}></div>
               </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

function ChevronIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
}

export default App;
