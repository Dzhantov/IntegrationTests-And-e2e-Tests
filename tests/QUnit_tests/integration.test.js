QUnit.config.reorder = false;

const baseUrl = 'http://localhost:3030';

let user = {
    username: '',
    email: '',
    password: '123456',
    gender: 'male',

};
let token = '';
let userId = '';

let meme = {
    title: '',
    description: '',
    imageUrl: '/images/2.png'
};

let lastCreatedMemeId = '';



QUnit.module('User functionalities', ()=>{

    QUnit.test('User registration', async(assert)=>{
        let path = '/users/register';
        let random = Math.floor(Math.random() * 1000);
        let randomUsername = `Auto_Test_User_${random}`;
        let randomEmail = `abv${random}@abv.bg`;
        user.username = randomUsername;
        user.email = randomEmail;

        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {'content-type' : 'application/jason'},
            body: JSON.stringify(user)
        });

        assert.ok(response.ok, 'successful response');

        let jsonResponse = await response.json();

        console.log(jsonResponse);

        assert.ok(jsonResponse.hasOwnProperty('email'), 'email exists');
        assert.equal(jsonResponse['email'],user.email, 'expected email');
        assert.strictEqual(typeof jsonResponse.email, 'string', 'email value is a string');

        assert.ok(jsonResponse.hasOwnProperty('username'), 'username exists');
        assert.equal(jsonResponse['username'],user.username, 'expected username');
        assert.strictEqual(typeof jsonResponse.username, 'string', 'username value is a string');

        assert.ok(jsonResponse.hasOwnProperty('password'), 'password exists');
        assert.equal(jsonResponse['password'],user.password , 'expected password');
        assert.strictEqual(typeof jsonResponse.password, 'string', 'password value is a string');

        assert.ok(jsonResponse.hasOwnProperty('gender'), 'gender exists');
        assert.equal(jsonResponse['gender'],user.gender , 'expected gender');
        assert.strictEqual(typeof jsonResponse.gender, 'string', 'gender value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof jsonResponse._id, 'string', '_id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof jsonResponse.accessToken, 'string', 'accessToken value is a string');

        token = jsonResponse['accessToken'];
        userId = jsonResponse['_id'];
        sessionStorage.setItem('meme-user', JSON.stringify(user));

        

    });

    QUnit.test('Login', async(assert)=>{

        let path = '/users/login';

        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {'content-type' : 'application/jason'},
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });

        assert.ok(response.ok, 'successful response');

        let jsonResponse = await response.json();

        console.log(jsonResponse);

        assert.ok(jsonResponse.hasOwnProperty('email'), 'email exists');
        assert.equal(jsonResponse['email'],user.email, 'expected email');
        assert.strictEqual(typeof jsonResponse.email, 'string', 'email value is a string');

        assert.ok(jsonResponse.hasOwnProperty('username'), 'username exists');
        assert.equal(jsonResponse['username'],user.username, 'expected username');
        assert.strictEqual(typeof jsonResponse.username, 'string', 'username value is a string');

        assert.ok(jsonResponse.hasOwnProperty('password'), 'password exists');
        assert.equal(jsonResponse['password'],user.password , 'expected password');
        assert.strictEqual(typeof jsonResponse.password, 'string', 'password value is a string');

        assert.ok(jsonResponse.hasOwnProperty('gender'), 'gender exists');
        assert.equal(jsonResponse['gender'],user.gender , 'expected gender');
        assert.strictEqual(typeof jsonResponse.gender, 'string', 'gender value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_id'), '_id exists');
        assert.strictEqual(typeof jsonResponse._id, 'string', '_id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('accessToken'), 'accessToken exists');
        assert.strictEqual(typeof jsonResponse.accessToken, 'string', 'accessToken value is a string');

        token = jsonResponse['accessToken'];
        userId = jsonResponse['_id'];
        sessionStorage.setItem('meme-user', JSON.stringify(user));

    });
});

QUnit.module('Meme functionalities', ()=>{
    QUnit.test('get all memes', async (assert)=>{

        let path = '/data/memes';
        let queryParam = '?sortBy=_createdOn%20desc';

        let response = await fetch( baseUrl + path + queryParam);

        assert.ok(response.ok, 'successful response'); 

        let jsonResponse = await response.json();

        assert.ok(Array.isArray(jsonResponse), 'response is array');

        console.log(jsonResponse);

        jsonResponse.forEach(element => {
            assert.ok(element.hasOwnProperty('description'), 'Property description exist');
            assert.strictEqual(typeof element.description, 'string', 'property is the correct value');

            assert.ok(element.hasOwnProperty('imageUrl'), 'Property imageUrl exist');
            assert.strictEqual(typeof element.imageUrl, 'string', 'property imageUrl is the correct value');

            assert.ok(element.hasOwnProperty('title'), 'Property title exist');
            assert.strictEqual(typeof element.title, 'string', 'property title is the correct value');

            assert.ok(element.hasOwnProperty('_createdOn'), 'Property _createdOn exist');
            assert.strictEqual(typeof element._createdOn, 'number', 'property _createdOn is the correct value');

            assert.ok(element.hasOwnProperty('_id'), 'Property _id exist');
            assert.strictEqual(typeof element._id, 'string', 'property _id is the correct value');

            assert.ok(element.hasOwnProperty('_ownerId'), 'Property _ownerId exist');
            assert.strictEqual(typeof element._ownerId, 'string', 'property _ownerId is the correct value');
        })
    });


    QUnit.test('Create meme', async (assert)=>{
        let path = '/data/meme';
        let random = Math.floor(Math.random() * 10000);

        meme.title = `Random meme title ${random}`;
        meme.description = `Random meme description ${random}`;

        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type' : 'application/jason',
                'X-Authorization' : token
            },
            body: JSON.stringify(meme)
        });

        assert.ok(response.ok, 'successful response');

        let jsonResponse = await response.json();

        console.log(jsonResponse);

            assert.ok(jsonResponse.hasOwnProperty('description'), 'Property description exist');
            assert.strictEqual(typeof jsonResponse.description, 'string', 'property is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('imageUrl'), 'Property imageUrl exist');
            assert.strictEqual(typeof jsonResponse.imageUrl, 'string', 'property imageUrl is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('title'), 'Property title exist');
            assert.strictEqual(typeof jsonResponse.title, 'string', 'property title is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('_createdOn'), 'Property _createdOn exist');
            assert.strictEqual(typeof jsonResponse._createdOn, 'number', 'property _createdOn is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('_id'), 'Property _id exist');
            assert.strictEqual(typeof jsonResponse._id, 'string', 'property _id is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('_ownerId'), 'Property _ownerId exist');
            assert.strictEqual(typeof jsonResponse._ownerId, 'string', 'property _ownerId is the correct value');

        lastCreatedMemeId = jsonResponse._id;
    });


    QUnit.test('Edit meme', async (assert)=>{

        let path = '/data/meme';
        let random = Math.floor(Math.random() * 10000);

        meme.title = `Edited meme title ${random}`;
        

        let response = await fetch(baseUrl + path + `/${lastCreatedMemeId}`, {
            method: 'PUT',
            headers: {
                'content-type' : 'application/jason',
                'X-Authorization' : token
            },
            body: JSON.stringify(meme)
        });

        assert.ok(response.ok, 'successful response');

        let jsonResponse = await response.json();

        console.log(jsonResponse);

            assert.ok(jsonResponse.hasOwnProperty('description'), 'Property description exist');
            assert.equal(jsonResponse.description, meme.description, 'expected description');
            assert.strictEqual(typeof jsonResponse.description, 'string', 'property is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('imageUrl'), 'Property imageUrl exist');
            assert.equal(jsonResponse.imageUrl, meme.imageUrl, 'expected imageUrl');
            assert.strictEqual(typeof jsonResponse.imageUrl, 'string', 'property imageUrl is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('title'), 'Property title exist');
            assert.equal(jsonResponse.title, meme.title, 'expected title');
            assert.strictEqual(typeof jsonResponse.title, 'string', 'property title is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('_createdOn'), 'Property _createdOn exist');
            assert.strictEqual(typeof jsonResponse._createdOn, 'number', 'property _createdOn is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('_id'), 'Property _id exist');
            assert.strictEqual(typeof jsonResponse._id, 'string', 'property _id is the correct value');

            assert.ok(jsonResponse.hasOwnProperty('_ownerId'), 'Property _ownerId exist');
            assert.strictEqual(typeof jsonResponse._ownerId, 'string', 'property _ownerId is the correct value');

            lastCreatedMemeId = jsonResponse._id;
    });
    QUnit.test('Delete meme', async (assert)=>{


        let path = '/data/meme';
        let response = await fetch(baseUrl + path + `/${lastCreatedMemeId}`, {
            method: 'DELETE',
            headers: {
                'X-Authorization' : token
            },
           
        });
        assert.ok(response.ok, 'successful response');
    });
});