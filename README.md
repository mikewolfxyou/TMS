# Project description


## Business description

A Subtitles Translator is a service that translates subtitles, it takes one or several subtitle files as input and produces the subtitles in the same format containing the translations of each one of the contained sentences. The translation is performed by using historical data stored in a [Translation Management System (TMS)](https://en.wikipedia.org/wiki/Translation_management_system). One translation is performed by going through the following steps:

1. Parses the subtitles file and extract the translatable source.
2. Translates the source using historical data.
3. Pairs the result with the source.
4. Reconstructs the subtitles file.

Below you can find an example of how a subtitles file looks like:

```
1 [00:00:12.00 - 00:01:20.00] I am Arwen - I've come to help you.
2 [00:03:55.00 - 00:04:20.00] Come back to the light.
3 [00:04:59.00 - 00:05:30.00] Nooo, my precious!!.
```

Is basically conformed by the id of the line, the time range, and then the content to be translated.

The output for this input would be a file containing something as:

```
1 [00:00:12.00 - 00:01:20.00] Ich bin Arwen - Ich bin gekommen, um dir zu helfen.
2 [00:03:55.00 - 00:04:20.00] Komm zurück zum Licht.
3 [00:04:59.00 - 00:05:30.00] Nein, my Schatz!!.
```

The second part of the system is the aforementioned TMS, as its name states, is a system that stores past translations to be reused, the structure of this system is really simple, it contains two endpoints, one for translating and the other for introducing data. 

In order to translate a query, it uses the following flow:

1. Search for strings that are **approximately** equal in the database — They might not be the same but close enough to be consider a translation.
2. It calculates the distance between the query and the closest string found. — A standard way of calculating strings distance is by using [Levenshtein distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance).
3. If the distance is less than 5, is considered a translation, otherwise the same query is returned as result.

In order to import data, it uses the following structure:

```json
[
  {
    "source": "Hello World",
    "target": "Hallo Welt",
    "sourceLanguage": "en",
    "targetLanguage": "de"
  },
  {
    "source": "Hello guys",
    "target": "Hallo Leute", 
    "sourceLanguage": "en",
    "targetLanguage": "de"
  },
  {
    "source": "I walk to the supermarket",
    "target": "Ich gehe zum Supermarkt.",
    "sourceLanguage": "en",
    "targetLanguage": "de"
  }
]
```

## System Design
![System Design](asset/design/TMS_Design.png?raw=true "System Design")
There are four components in whole system:
- Translation Submit API (`Submitter`)
- Translation Management System (`TMS`)
- Email Service (`ES`)
- TinyTM

1. Client could use translation submit api upload max. 5 subtitle files, The `Submitter` will save the
files to `uploads` folder then send the translation request to `TMS`, each file will be a single API call.
2. The translation request will be saved in DB, `TMS` use the open source [TinyTM](http://tinytm.sourceforge.net/en/technology/protocol.html) 
do the translation work (A set of db tables and procedures, which use Levenshtein distance algorithm), because each 
uploaded file is a single API call, therefore each file will be parallel translated, when all uploaded files have been 
translated, `TMS` will send an API 
call to Email Service(`ES`)
3. `ES` use [Nodemailer](https://nodemailer.com/about/) send to client an email include all original files name and 
translated files saving paths, the preview email link will be logged in console for debugging   

## Development 
### Run in docker
1. Build the translation app
```shell
docker build -t miketms -f dockers/Translation.Dockerfile .
```
2. Run docker-compose, application will be ran with PostgreSQL and TinyTM together
```shell
docker-compose up
```
3. Use Postman import collection from `asset/postman`
4. Send API call - `SubmitTranslationRequest`, the files could be in `asset/test_files` 
5. The translated file could be found in folder `translated`
6. The mock email link could be found in the console log 
### Run in local command line
1. Run test
```shell
npm run test
```
2. Run application, first you need install PostgreSQL on you local, and run SQL files in `asset/database` the running 
   orders could be found in `docker-compose.yml`, then you can run 
```shell
npm run local
```
3. Use Postman import collection from `asset/postman`
4. Send API call - `SubmitTranslationRequest`, the files could be in `asset/test_files`
5. The translated file could be found in folder `translated`
6. The mock email link could be found in the console log

## Async event driven system instead of sync API system design
![System Design](asset/design/Async_Sytem_Design.png?raw=true "System Design")
The async event driver system introduce Apache Kafka, the components communicate via messages, the benefits:
- If one or more components failed, or temporary can not provide service, the other components could still work and not 
  be affected, when the failed components back online, could continue work from the stop point. 
- Easily append new component and not need change other component if the message model not be changed, e.g. after 
  translated a file, we want to do more than sending Email but other thing, we could just append the new service, 
  and not need change `TMS` code to do other API-call to the new appended service. 
