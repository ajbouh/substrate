# we'll pull dependencies of cosmos from here
FROM docker.io/library/busybox as prereqs
# FROM docker.io/tianon/toybox:latest as prereqs

# define a starting point "scratch" image that can run APEs
FROM scratch as cosmos-scratch
COPY --from=prereqs /bin/uname /usr/bin/
ADD --chmod=0755 https://cosmo.zip/pub/cosmos/v/3.9.2/bin/assimilate-x86_64.elf /usr/bin/assimilate.elf
ADD --chmod=0755 https://cosmo.zip/pub/cosmos/v/3.9.2/bin/dash /bin/sh
# COPY --from=prereqs /bin/sh /bin/
RUN ["/usr/bin/assimilate.elf", "-c", "/bin/sh"]
ADD --chmod=0755 https://cosmo.zip/pub/cosmos/v/3.9.2/bin/ape-x86_64.elf /usr/bin/ape
ENV PATH=/bin:/usr/bin

FROM cosmos-scratch as llamafile-gguf
ARG LLAMAFILE_VERSION=0.8.16
ADD --chmod=0755 https://github.com/Mozilla-Ocho/llamafile/releases/download/${LLAMAFILE_VERSION}/llamafile-${LLAMAFILE_VERSION} /usr/bin/llamafile
ADD --chmod=0755 https://github.com/Mozilla-Ocho/llamafile/releases/download/${LLAMAFILE_VERSION}/llamafiler-${LLAMAFILE_VERSION} /usr/bin/llamafiler
ADD --chmod=0755 https://github.com/Mozilla-Ocho/llamafile/releases/download/${LLAMAFILE_VERSION}/zipalign-${LLAMAFILE_VERSION} /usr/bin/zipalign
RUN /usr/bin/assimilate.elf -c /usr/bin/llamafile
RUN /usr/bin/assimilate.elf -c /usr/bin/llamafiler
RUN /usr/bin/assimilate.elf -c /usr/bin/zipalign
ENV PORT=8080
ENV HOST=0.0.0.0
# ENV LLAMAFILE_GGUF
# COPY images/llamafile/llama.cpp/server/public /srv/public
ENTRYPOINT ["/bin/sh", "-c", "exec /usr/bin/llamafiler -l \"${HOST}:${PORT}\" -m \"${LLAMAFILE_GGUF}\" \"$@\"", "sh"]

FROM docker.io/nvidia/cuda:12.3.2-devel-ubuntu22.04 as devel-llamafile-cuda
ARG LLAMAFILE_VERSION=0.8.16
COPY --from=llamafile-gguf /usr/bin/llamafile /usr/bin/llamafiler /usr/bin/zipalign /usr/bin/
# HACK we need to assimilate so this can run on github actions...
COPY --from=cosmos-scratch /usr/bin/assimilate.elf /usr/bin/
RUN /usr/bin/assimilate.elf -c /usr/bin/llamafile
RUN /usr/bin/assimilate.elf -c /usr/bin/llamafiler
RUN /usr/bin/assimilate.elf -c /usr/bin/zipalign
ENV LD_LIBRARY_PATH=/usr/local/cuda/targets/x86_64-linux/lib:/usr/local/cuda/compat:/lib:/lib64
# HACK get llamafile to build stubs we can use at runtime. would be better to use a "only compile stubs" entrypoint
RUN ldconfig && (/usr/bin/llamafiler -m /dev/null --recompile --gpu NVIDIA < /dev/null || true) \
  && [ -e /root/.cosmo ] && [ -e /root/.llamafile ] \
  && find /root \
  && find /root -name '*.so' -exec ldd {} ';' \
  && (cd /root/.llamafile/v/${LLAMAFILE_VERSION}; zipalign -j0 /usr/bin/llamafiler ggml-cuda.so)

FROM cosmos-scratch as llamafile-gguf-cuda
COPY --from=devel-llamafile-cuda /usr/local/cuda/targets/x86_64-linux/lib/libcublas.so.12 /usr/local/cuda/targets/x86_64-linux/lib/libcublasLt.so.12 /usr/local/cuda/targets/x86_64-linux/lib/
COPY --from=devel-llamafile-cuda /usr/local/cuda/compat/libcuda.so.1 /usr/local/cuda/compat/
COPY --from=devel-llamafile-cuda /lib64/ld-linux-x86-64.so.2 /lib64/ld-linux-x86-64.so.2
COPY --from=devel-llamafile-cuda /lib/x86_64-linux-gnu/libstdc++.so.6 /lib/x86_64-linux-gnu/libm.so.6 /lib/x86_64-linux-gnu/libgcc_s.so.1 /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/librt.so.1 /lib/x86_64-linux-gnu/libpthread.so.0 /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libresolv.so.2 /lib/x86_64-linux-gnu/
COPY --from=devel-llamafile-cuda /sbin/ldconfig.real /sbin/ldconfig
WORKDIR /root
COPY --from=devel-llamafile-cuda /root/.cosmo /root/.cosmo
COPY --from=devel-llamafile-cuda /usr/bin/llamafiler /usr/bin/
COPY --from=llamafile-gguf /srv/public/. /srv/public/

ENV PATH=/bin:/usr/bin
ENV HOME=/root
ENV LD_LIBRARY_PATH=/usr/local/cuda/targets/x86_64-linux/lib:/usr/local/cuda/compat:/lib:/lib64
ARG LLAMAFILE_N_GPU_LAYERS=9999
ENV LLAMAFILE_N_GPU_LAYERS=${LLAMAFILE_N_GPU_LAYERS}
ENV PORT=8080
ENV HOST=0.0.0.0
# ENV LLAMAFILE_GGUF
# HACK this ld.so.conf and ldconfig call is so gross. This is something that the nvidia ctk hooks are supposed to do automatically
ENTRYPOINT ["/bin/sh", "-c", "echo /lib64 >> /etc/ld.so.conf; /sbin/ldconfig -v; exec /usr/bin/llamafiler -ngl \"${LLAMAFILE_N_GPU_LAYERS}\" -l \"${HOST}:${PORT}\" -m \"${LLAMAFILE_GGUF}\" \"$@\"", "sh"]
