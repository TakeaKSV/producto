import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_EXCHANGE = "producto_event";
const PRODUCTO_CREATED_KEY = "producto.created";
const PRODUCTO_UPDATED_KEY = "producto.updated";
const INVENTORY_QUEUE = "inventory_update_queue";

export async function productoCreatedEvent(producto) {
  let connection;
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672');
    const channel = await connection.createChannel();

    // Declarar exchange
    await channel.assertExchange(RABBITMQ_EXCHANGE, "topic", { durable: true });
    
    // Asegurar que existe la cola para actualización de inventario
    await channel.assertQueue(INVENTORY_QUEUE, { durable: true });
    await channel.bindQueue(INVENTORY_QUEUE, RABBITMQ_EXCHANGE, PRODUCTO_CREATED_KEY);

    // Publicar el evento
    const message = JSON.stringify(producto);
    channel.publish(
      RABBITMQ_EXCHANGE,
      PRODUCTO_CREATED_KEY,
      Buffer.from(message)
    );

    console.log(
      `✅ Evento publicado en exchange "${RABBITMQ_EXCHANGE}", routing key "${PRODUCTO_CREATED_KEY}": ${message}`
    );

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error publicando evento de producto creado:", error);
  }
}

export async function productoUpdatedEvent(producto) {
  let connection;
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672');
    const channel = await connection.createChannel();

    // Declarar exchange
    await channel.assertExchange(RABBITMQ_EXCHANGE, "topic", { durable: true });
    
    // Asegurar que existe la cola para actualización de inventario
    await channel.assertQueue(INVENTORY_QUEUE, { durable: true });
    await channel.bindQueue(INVENTORY_QUEUE, RABBITMQ_EXCHANGE, PRODUCTO_UPDATED_KEY);

    // Publicar el evento
    const message = JSON.stringify(producto);
    channel.publish(
      RABBITMQ_EXCHANGE,
      PRODUCTO_UPDATED_KEY,
      Buffer.from(message)
    );

    console.log(
      `✅ Evento publicado en exchange "${RABBITMQ_EXCHANGE}", routing key "${PRODUCTO_UPDATED_KEY}": ${message}`
    );

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error publicando evento de producto creado:", error);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error al cerrar conexión RabbitMQ:", err);
      }
    }
  }
}