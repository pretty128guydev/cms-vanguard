"use client"
import React, { useState, useEffect } from 'react';

const FormPage = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {
    // Check for MediaRecorder support
    if (!navigator.mediaDevices || !MediaRecorder) {
      alert('MediaRecorder not supported on your browser, use Firefox or Chrome instead.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (audioUrl) {
            // Clean up the old URL
            URL.revokeObjectURL(audioUrl);
          }
          const audioBlob = event.data;
          const newAudioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(newAudioUrl);
        };
      })
      .catch((err) => {
        console.error('Could not access microphone:', err);
        alert('Could not access microphone, please check permissions.');
      });

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
      }
    };
  }, [audioUrl, mediaRecorder]);

  const startRecording = () => {
    if (mediaRecorder) {
      setIsRecording(true);
      mediaRecorder.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setIsRecording(false);
      mediaRecorder.stop();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted Text:", text);
    console.log("Audio URL:", audioUrl);
    // Submit text or audioUrl to your backend here
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Type here or use voice recording..."
        rows="4"
        cols="50"
      />
      <button type="button" onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormPage;
