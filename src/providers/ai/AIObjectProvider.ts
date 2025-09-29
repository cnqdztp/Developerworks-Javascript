import { AuthManager } from '../../auth/AuthManager';
import { IObjectProvider } from '../IProvider';
import { ObjectGenerationRequest, ObjectGenerationResponse } from '../../public/DataModels';

export class AIObjectProvider implements IObjectProvider {
  private _authManager: AuthManager;
  private _baseUrl: string = 'https://developerworks.agentlandlab.com';

  constructor(authManager: AuthManager) {
    this._authManager = authManager;
  }

  isReady(): boolean {
    return this._authManager.isReady();
  }

  async generateObjectAsync(request: ObjectGenerationRequest): Promise<ObjectGenerationResponse> {
    try {
      const authToken = this._authManager.getAuthToken();
      if (!authToken) {
        throw new Error('No authentication token available');
      }

      // Convert object generation request to chat completion request
      const chatRequest = {
        model: request.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant. Please respond to the user's request and format your response as valid JSON according to this schema: ${request.schema}`
          },
          {
            role: 'user',
            content: request.prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      };

      const response = await fetch(`${this._baseUrl}/ai/${this._authManager.publishableKey}/v1/generateObject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(chatRequest),
        signal: AbortSignal.timeout(90000) // 90 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const chatResponse = await response.json();
      
      if (chatResponse.choices && chatResponse.choices.length > 0) {
        const content = chatResponse.choices[0].message.content;
        
        try {
          const parsedData = JSON.parse(content);
          return {
            content: content,
            parsedData: parsedData
          };
        } catch (parseError) {
          return {
            content: content,
            parsedData: null
          };
        }
      } else {
        throw new Error('No response content received');
      }
    } catch (error) {
      throw new Error(`Object generation failed: ${error}`);
    }
  }

  validateRequest(request: ObjectGenerationRequest): boolean {
    if (!request.prompt || request.prompt.trim().length === 0) {
      return false;
    }

    if (!request.schema || request.schema.trim().length === 0) {
      return false;
    }

    try {
      JSON.parse(request.schema);
    } catch (error) {
      return false;
    }

    return true;
  }

  validateSchema(schema: string): boolean {
    try {
      const parsed = JSON.parse(schema);
      return typeof parsed === 'object' && parsed !== null;
    } catch (error) {
      return false;
    }
  }
}
