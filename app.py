from flask import Flask, render_template, Response
from pykafka import KafkaClient
from pykafka.common import OffsetType

def get_kafka_client():
    return KafkaClient(hosts='localhost:9092')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Consumer API
@app.route('/topic/<topicname>')
def get_messages(topicname):
    client = get_kafka_client()
    
    # Convert the topic name to a byte string
    topicname_bytes = topicname.encode('utf-8')

    def events():
        # Without this, each new SSE connection has no consumer group to
        # resume from, so pykafka defaults to replaying the topic from the
        # earliest offset - a new browser tab would see the full backlog of
        # past positions instead of jumping straight to live ones.
        consumer = client.topics[topicname_bytes].get_simple_consumer(
            auto_offset_reset=OffsetType.LATEST,
            reset_offset_on_start=True,
        )
        for i in consumer:
            if i.value is not None:
                try:
                    yield f'data:{i.value.decode("utf-8")}\n\n'
                except UnicodeDecodeError as e:
                    print(f"Error decoding message: {e}")
                    continue

    return Response(events(), mimetype="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
