import { WebClient, ChatPostMessageResponse } from '@slack/web-api';
import * as dotenv from 'dotenv';

// Load variables from .env into process.env
dotenv.config();

export class SlackTool {
  private client: WebClient;
  private defaultChannelId: string;

  constructor() {
    const token = process.env.SLACK_BOT_TOKEN;
    const channelId = process.env.SLACK_CHANNEL_ID;

    // Validate that environment variables are present
    if (!token || !channelId) {
      throw new Error('Missing SLACK_BOT_TOKEN or SLACK_CHANNEL_ID in environment variables.');
    }

    this.client = new WebClient(token);
  }

  /**
   * Sends a message using the default channel or a provided override.
   */
  async sendMessage(text: string): Promise<ChatPostMessageResponse> {
    try {
      const result = await this.client.chat.postMessage({
        channel: this.channelId,
        text: text,
      });

      console.log(`Message sent: ${result.ts}`);
      return result;
    } catch (error) {
      console.error('SlackTool Error:', error);
      throw error;
    }
  }
}
