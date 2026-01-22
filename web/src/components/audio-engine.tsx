'use client';

import { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

interface AudioEngineProps {
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
}

export function AudioEngine({ audioContext, sourceNode }: AudioEngineProps) {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioContext || !sourceNode) return;

    // Create audio nodes
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    const gainNode = audioContext.createGain();
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    // Connect: source → analyser → compressor → gain → destination
    sourceNode.connect(analyser);
    analyser.connect(compressor);
    compressor.connect(gainNode);
    gainNode.connect(audioContext.destination);

    analyserRef.current = analyser;
    gainNodeRef.current = gainNode;

    // Load AI model for EQ (optional - requires trained model)
    // Uncomment when you have a trained model
    /*
    tf.loadLayersModel('/ai-eq-model.json')
      .then((model) => {
        modelRef.current = model;
      })
      .catch((err) => {
        console.warn('AI EQ model not found, using default EQ:', err);
      });
    */

    // Real-time audio processing
    const processAudio = () => {
      if (!analyserRef.current) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Apply AI EQ if model is loaded
      if (modelRef.current && gainNodeRef.current) {
        // Convert frequency data to tensor
        const input = tf.tensor2d([Array.from(dataArray).map((v) => v / 255)]);
        
        // Predict EQ adjustments
        const prediction = modelRef.current.predict(input) as tf.Tensor;
        const values = prediction.dataSync();
        
        // Apply gain adjustment (example: bass boost)
        const bassBoost = values[0] || 1.2;
        gainNodeRef.current.gain.value = Math.min(bassBoost, 2.0);
        
        // Cleanup tensors
        input.dispose();
        prediction.dispose();
      }

      animationFrameRef.current = requestAnimationFrame(processAudio);
    };

    processAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceNode) {
        sourceNode.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
    };
  }, [audioContext, sourceNode]);

  return null; // This is a logic-only component
}
