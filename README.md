For Clone this project
```sheel
git clone https://github.com/SosialVibe/sosialvibe-backend.git
```

in the project, before runing, make sure create `folder` below in root `directory` project
- public/uploads/images
- public/upload/videos

and run npm install in `directory` project 
```sheel
npm install && npm update
```

copy .env.example to .env
```sheel
cp .env.example .env
```

config file .env to your details, below is default config, `CLIENT_URL` mean you give this url to access for your API,
you can give an array if you want
```sheel
DB_URI=mongodb://localhost:27017/db_name
PORT=5000
SECRET_KEY=secretkey
CLIENT_URL=["http://example.com"]
```
make sure your database is running (if use local mongodb), and you can run the project
```
npm run dev
```