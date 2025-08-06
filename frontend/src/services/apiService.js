// API service for communicating with FastAPI backend
const API_BASE_URL = 'https://muhammedemireren-glowii.hf.space/';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.currentProcessorId = null;
  }

  async uploadImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // This data now contains base64
      
      console.log('Upload response data:', data); // Debug log to see the structure
      
      // Save base64 image to public folder
      const base64Image = data.image || data;
      if (base64Image) {
        const fileName = `uploaded_${Date.now()}.png`;
        const publicPath = `/${fileName}`;
        
        try {
          // Convert base64 to blob
          const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/png' });
          
          // Save to public folder (this creates a downloadable link)
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          
          // Save the image data to localStorage for persistence
          localStorage.setItem(`image_${fileName}`, base64Image);
          
          return publicPath; // Return the public path
        } catch (error) {
          console.error('Error saving image to public folder:', error);
          return base64Image; // Fallback to base64 if saving fails
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async enhanceImage(imagePath, background = null) {
    try {
      const response = await fetch(`${this.baseURL}/enhance_and_return_all_options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_path: imagePath,
          background: background
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store the processor ID for later use
      this.currentProcessorId = data.processor_id;
      
      return data;
    } catch (error) {
      console.error('Error enhancing image:', error);
      throw error;
    }
  }

  async chooseImageAndGenerateDescription(optionNumber) {
    try {
      if (!this.currentProcessorId) {
        throw new Error('No active processor. Please enhance an image first.');
      }

      const response = await fetch(`${this.baseURL}/choose_image_and_generate_description?processor_id=${this.currentProcessorId}&option_number=${optionNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating description:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      if (!this.currentProcessorId) {
        return;
      }

      await fetch(`${this.baseURL}/cleanup/${this.currentProcessorId}`, {
        method: 'DELETE',
      });

      this.currentProcessorId = null;
    } catch (error) {
      console.error('Error cleaning up:', error);
      // Don't throw error for cleanup failures
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  async searchProduct(query) {
    try {
      const response = await fetch(`${this.baseURL}/get_search_results?query=${encodeURIComponent(query)}`, {
        method: 'POST',
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Access the link inside the results object
      if (data.results && data.results[0].link) {
        console.log('Inside the if statement, data.results[0].link:');
        return data.results[0].link;
        
      }
      
      console.warn('Could not find results.link field in response');
      return null;
    } catch (error) {
      console.error('Error searching product:', error);
      throw error;
    }
  }

  async generateBackgroundImage(prompt) {
    try {
      const response = await fetch(`${this.baseURL}/generate_background?promptFromUser=${encodeURIComponent(prompt)}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data); // Debug log
      
      return {
        image: data.image,
        filePath: data.file_path,
        publicUrl: data.public_url,
        fileName: data.file_name
      };
    } catch (error) {
      console.error('Error generating background image:', error);
      throw error;
    }
  }
}

export default new ApiService();
