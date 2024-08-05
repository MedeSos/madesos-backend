For Clone this project
```sheel
git clone https://github.com/SosialVibe/sosialvibe-backend.git
```

in the project, before runing, make sure create `folder` below in root `directory` project
- public/uploads/images
- public/upload/videos

And run npm install in `directory` project 
```sheel
npm install && npm update
```

Copy file `.env.example` in root `directory` and rename to `.env`, or you can use command below, 
```sheel
cp .env.example .env
```

Configure the value of the constant that has been provided in the .env file with your details
```sheel
DB_URI=mongodb://localhost:27017/db_name 
PORT=5000                                
SECRET_KEY=secretkey                     
CLIENT_URL=http://example.com        
```
#### DB_URI 
you can change the url or Database Name

#### PORT
you can set what ever port you want 

#### SECRET_KEY
Default JWT is secretkey, change to random string for secure

#### CLIENT_URL
This part if you want to allow your API to client, you can give more than one client url to access your API, example:
```shell
CLIENT_URL= http://example.com,https://mydomain.com
```

Make sure your database is running (if use local mongodb), and you can run the project
```
npm run dev
```

### API Doc
You need to run the server if you want to access API Doc, make sure you replace `{port}` with the same value as `PORT` in your `.env` file
```
http://localhost:{port}/v1/docs
```

