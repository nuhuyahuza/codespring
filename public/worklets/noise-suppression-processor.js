class NoiseSuppressionProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.noiseThreshold = -50; // dB
    this.smoothingFactor = 0.95;
    this.noiseProfile = new Float32Array(this.bufferSize);
    this.isLearningNoise = true;
    this.learningFrames = 0;
    this.maxLearningFrames = 50;
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      if (this.isLearningNoise) {
        // Learn noise profile
        for (let i = 0; i < inputChannel.length; i++) {
          this.noiseProfile[i] = Math.max(
            Math.abs(inputChannel[i]),
            this.noiseProfile[i]
          );
        }

        this.learningFrames++;
        if (this.learningFrames >= this.maxLearningFrames) {
          this.isLearningNoise = false;
        }
      } else {
        // Apply noise suppression
        for (let i = 0; i < inputChannel.length; i++) {
          const magnitude = Math.abs(inputChannel[i]);
          if (magnitude < this.noiseProfile[i] * 1.5) {
            outputChannel[i] = 0;
          } else {
            outputChannel[i] = inputChannel[i];
          }
        }
      }
    }

    return true;
  }
}

registerProcessor('noise-suppression-processor', NoiseSuppressionProcessor); 