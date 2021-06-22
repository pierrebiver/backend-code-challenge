import amqp from "amqplib";

let connection;

export async function initializeQueue() {
    connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    channel.assertQueue("area");
    channel.assertQueue("area-result");

    return channel;
}

export function closeQueueConnection() {
    if (connection !== undefined) {
        connection.close();
    }
}