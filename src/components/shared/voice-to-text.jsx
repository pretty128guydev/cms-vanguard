"use client";
import { useState, useEffect } from "react";
import { CiMicrophoneOn } from "react-icons/ci"; // Make sure you have this icon or adjust accordingly
import { useClaimFormContext } from "@/context/claimform-provider";
import { ErrorMessage } from "@hookform/error-message";

const VoiceToTextTextarea = ({ name, label, isRequired, register }) => {
  const { errors, getValues, setValue } = useClaimFormContext();
  const [text, setText] = useState(getValues(name) || "");
  const [interimText, setInterimText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    // console.log(getValues(name));
    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US";

    speechRecognition.onstart = () => {
      setIsRecording(true);
    };

    speechRecognition.onend = () => {
      setIsRecording(false);
      setIsListening(false); // Ensure the isListening state is updated
    };

    speechRecognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setText((prevText) => prevText + finalTranscript);
      setInterimText(interimTranscript);
      setValue(name, text + finalTranscript + interimTranscript);
    };

    speechRecognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false); // Ensure the isListening state is updated in case of error
    };

    setRecognition(speechRecognition);
  }, [name, setValue]);

  const handleListen = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="py-2">
      <div className="flex gap-4">
        <textarea
          name={name}
          placeholder={`${label}${isRequired ? "*" : ""}`}
          className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3 h-24"
          {...register(name, { required: isRequired })}
          value={text + interimText}
          onChange={(e) => {
            setText(e.target.value);
            setValue(name, e.target.value);
          }}
        ></textarea>
        <div
          onClick={handleListen}
          className={`p-3 cursor-pointer h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center ${isRecording ? "animate-ping" : ""}`}
        >
          <CiMicrophoneOn className="text-white" />
        </div>
      </div>
      {errors && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({}) => (
            <p className="text-red-600 -mt-2 text-xs mb-2">
              {label} is required
            </p>
          )}
        />
      )}
    </div>
  );
};

export default VoiceToTextTextarea;
