import ampq from "amqplib";

export class RabbitClient {
  private queue_name: string = "video_queue";
  private connection: ampq.Connection | null = null;
  public channel: ampq.Channel | null = null;

  public async initialize() {
    try {
      if (this.isInitialized()) return this.channel;

      this.connection = await this.connect();
      this.channel = await this.createChannel(this.connection);

      return this.channel;
    } catch (error) {
      return this.channel
    }
  }

  private isInitialized(): boolean {
    return this.connection && this.channel ? true : false;
  }
  private async connect() {
    let connection = await ampq.connect(process.env.RABBITMQ_URL as string);

    connection.on("close", () => {
      this.connection = null;
      this.channel = null;
    })

    return connection;
  }

  private async createChannel(connection: ampq.Connection) {
    let channel = await connection.createChannel();

    channel.on("close", () => {
      this.channel = null;
    })

    await channel.assertQueue(this.queue_name, {
      durable: true
    })

    process.on("beforeExit", this.closeRabbitMQConnection.bind(null, channel, connection));
    return channel;
  }

  private closeRabbitMQConnection(channel: ampq.Channel, connection: ampq.Connection) {
    channel.close();
    connection.close();
  }
}

export const rabbitClient = new RabbitClient();