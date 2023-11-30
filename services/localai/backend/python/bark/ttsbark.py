#!/usr/bin/env python3
"""
This is an extra gRPC server of LocalAI for Bark TTS
"""
from concurrent import futures
import time
import argparse
import signal
import sys
import os
from scipy.io.wavfile import write as write_wav

import backend_pb2
import backend_pb2_grpc
from bark import SAMPLE_RATE, generate_audio, preload_models

import grpc


_ONE_DAY_IN_SECONDS = 60 * 60 * 24

# If MAX_WORKERS are specified in the environment use it, otherwise default to 1
MAX_WORKERS = int(os.environ.get('PYTHON_GRPC_MAX_WORKERS', '1'))

# Implement the BackendServicer class with the service methods
class BackendServicer(backend_pb2_grpc.BackendServicer):
    """
    BackendServicer is the class that implements the gRPC service
    """
    def Health(self, request, context):
        return backend_pb2.Reply(message=bytes("OK", 'utf-8'))
    def LoadModel(self, request, context):
        model_name = request.Model
        try:
            print("Preparing models, please wait", file=sys.stderr)
            # download and load all models
            preload_models()
        except Exception as err:
            return backend_pb2.Result(success=False, message=f"Unexpected {err=}, {type(err)=}")
        # Implement your logic here for the LoadModel service
        # Replace this with your desired response
        return backend_pb2.Result(message="Model loaded successfully", success=True)

    def TTS(self, request, context):
        model = request.model
        print(request, file=sys.stderr)
        try:
            audio_array = None
            if model != "":
                audio_array = generate_audio(request.text, history_prompt=model)
            else:
                audio_array = generate_audio(request.text)
            print("saving to", request.dst, file=sys.stderr)
            # save audio to disk
            write_wav(request.dst, SAMPLE_RATE, audio_array)
            print("saved to", request.dst, file=sys.stderr)
            print("tts for", file=sys.stderr)
            print(request, file=sys.stderr)
        except Exception as err:
            return backend_pb2.Result(success=False, message=f"Unexpected {err=}, {type(err)=}")
        return backend_pb2.Result(success=True)

def serve(address):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=MAX_WORKERS))
    backend_pb2_grpc.add_BackendServicer_to_server(BackendServicer(), server)
    server.add_insecure_port(address)
    server.start()
    print("Server started. Listening on: " + address, file=sys.stderr)

    # Define the signal handler function
    def signal_handler(sig, frame):
        print("Received termination signal. Shutting down...")
        server.stop(0)
        sys.exit(0)

    # Set the signal handlers for SIGINT and SIGTERM
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the gRPC server.")
    parser.add_argument(
        "--addr", default="localhost:50051", help="The address to bind the server to."
    )
    args = parser.parse_args()

    serve(args.addr)
