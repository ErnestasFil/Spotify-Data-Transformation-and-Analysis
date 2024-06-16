# Spotify Data Transformation and Analysis

## Task Description:

This task entails the ingestion, transformation, and analysis of Spotify sample
datasets from Kaggle. The task involves using a Node.js script to clean up and organise these
datasets and SQL for data analysis.

## Setup

### 1. Clone repository

First of all clone **_Spotify Data Transformation and Analysis_** repository, it can be done using this command using **Command Prompt**:

```bash
git clone https://github.com/ErnestasFil/Spotify-Data-Transformation-and-Analysis.git
```

### 2. Environment file

To make the system work, you should copy example environment file and fill empty variables. If you not closed **Command Prompt** after copying repository, you can use these commands:

```bash
cd Spotify-Data-Transformation-and-Analysis
copy .env.example .env
```

Open copied **.env** file and fill empty variables:

```ts
DATA_FOLDER = 'data'                    // folder name, from where will be taken datasets
FILTERED_DATA_FOLDER = 'filtered_data'  // folder name, in which will be saved files from S3
RESULTS_FOLDER = 'results'              // folder name, in which will be saved results after analysis
TRACK_NAME_LENGHT = 0                   // minimum number of characters in a name to remove a track
TRACK_MIN_LENGHT = 1                    // minimum track lenght in minutes

S3_BUCKET_NAME =                        // AWS S3 bucket name
S3_REGION =                             // AWS S3 region
S3_ACCESS_KEY =                         // AWS IAM user access key
S3_SECRET_KEY =                         // AWS IAM user secret key

DB_HOST = '127.0.0.1'                   // PostgreSQL host
DB_USERNAME = 'postgres'                // PostgreSQL username
DB_PASSWORD =                           // PostgreSQL password
DB_DATABASE =                           // PostgreSQL database
```

### 3. Datasets

Download all Spotify sample datasets and copy them to **_data_** folder, which can be found inside copied repository:

[Kaggle - artists.csv](https://www.kaggle.com/datasets/yamaerenay/spotify-dataset-19212020-600k-tracks?select=artists.csv)

[Kaggle - tracks.csv](https://www.kaggle.com/datasets/yamaerenay/spotify-dataset-19212020-600k-tracks?select=tracks.csv)

_Datasets can be copied to different folder inside copied repository, but it is important to change_ **_DATA_FOLDER_** _variable in environment file .env_

### 4. PostgreSQL docker

To use PostgeSQL we will use docker which will be hosted locally. First of all, open Docker application and using **Command Prompt** create new instance:

```bash
docker run --name postgresSpotify -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
```

After creating instance add information about database to **.env** file:

```ts
DB_USERNAME = 'postgres';
DB_PASSWORD = 'password';
```

To create new database, use these commands in new **Command Promt** window:

```bash
docker exec -it postgresSpotify bash
```

```bash
psql -h localhost -U postgres
```

And create new database and place that name into **.env** file:

```bash
CREATE DATABASE spotify;
```

```ts
DB_DATABASE = 'spotify';
```

### 5. Package installation

Another very important step is to install needed packages. Inside copied repository open **Command Promt** and using this command install them:

```bash
npm install
```

### 6. Database migration

To migrate all needed data tables use this command:

```bash
npm run migrate:latest
```

### 7. Run data transformation and analysis

Everything is done using one command, which will filter all not needed information, upload to S3 bucket, download from there and create results file.

_Environment variables should be set correctly!_:

```bash
npm run start:full
```

Every step is shown in **Command Promt** window and all results will be found in _results_ folder.

### 8. Run tests

Using **Command Promt** use this command to run tests and see coverage:

```bash
npm test --coverage
```
