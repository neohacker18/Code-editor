FROM node:latest

WORKDIR /app

RUN apt-get update \
    && apt-get install -y build-essential \
                           wget \
                           p7zip-full \
                           cmake \
                           redis-server \
                           redis-tools

COPY package*.json ./
RUN npm install

COPY . /app

RUN mkdir /app/mingw64 \
    && cd /app/mingw64 \
    && wget https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win32/Personal%20Builds/mingw-builds/8.1.0/threads-posix/sjlj/i686-8.1.0-release-posix-sjlj-rt_v6-rev0.7z \
    && 7z x i686-8.1.0-release-posix-sjlj-rt_v6-rev0.7z \
    && rm i686-8.1.0-release-posix-sjlj-rt_v6-rev0.7z

ENV PATH="/app/mingw64/i686-8.1.0-release-posix-sjlj-rt_v6-rev0/bin:${PATH}"

EXPOSE 80
EXPOSE 6379

CMD ["sh", "-c", "npm run start && redis-server && redis-cli ping"]
