// lib/stream.ts
export async function readStream(
    stream: ReadableStream<Uint8Array>,
    onStream: (content: string) => void
  ): Promise<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let result = '';
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
      onStream(chunk);
    }
  
    // Finalize the decoding for any remaining bytes
    result += decoder.decode();
    onStream(result);
    
    reader.releaseLock();
    return result;
  }