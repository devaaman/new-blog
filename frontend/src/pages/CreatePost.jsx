import React, { useContext, useState } from 'react';
import { ImCross } from 'react-icons/im';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import axios from "axios"
import { URL } from "../url"
const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const { user } = useContext(UserContext);
    const [cat, setCat] = useState("");
    const [cats, setCats] = useState([]);
    const navigate = useNavigate();

    const deleteCategory = (i) => {
        let updatedCats = [...cats];
        updatedCats.splice(i, 1);
        setCats(updatedCats);
    };

    const addCategory = () => {
        let updatedCats = [...cats];
        updatedCats.push(cat);
        setCat("");
        setCats(updatedCats);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const post = {
            title,
            desc,
            username: user.username,
            userId: user._id,
            categories: cats
        };

        if (file) {
            const cloudName = "dppoe8r21";
            const cld = new Cloudinary({ cloud: { cloudName } });

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'patnadge'); 

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const data =  await response.json();
                post['photo'] = data.secure_url;
                const createPostResponse = await axios.post(URL + "/api/posts/create", post);
                navigate(`/posts/post/${createPostResponse.data._id}`);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        } else {
            try {
                const createPostResponse = await axios.post(URL + "/api/posts/create", post);
                navigate(`/posts/post/${createPostResponse.data._id}`);
            } catch (error) {
                console.error('Error creating post:', error);
            }
        }
    };

    return (
        <div>
            {/* Your Navbar and Footer components */}
            <form onSubmit={handleCreate}>
                <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter post title' className='px-4 py-2 outline-none' required />
                <input onChange={(e) => setFile(e.target.files[0])} type="file" className='px-4' />
                <div className='flex flex-col'>
                    <div className='flex items-center space-x-4 md:space-x-8'>
                        <input value={cat} onChange={(e) => setCat(e.target.value)} className='px-4 py-2 outline-none' placeholder='Enter post category' type="text" />
                        <div onClick={addCategory} className='bg-black text-white px-4 py-2 font-semibold cursor-pointer'>Add</div>
                    </div>
                    <div className='flex px-4 mt-3'>
                        {cats?.map((c, i) => (
                            <div key={i} className='flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md'>
                                <p>{c}</p>
                                <p onClick={() => deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'><ImCross /></p>
                            </div>
                        ))}
                    </div>
                </div>
                <textarea onChange={(e) => setDesc(e.target.value)} rows={15} cols={30} className='px-4 py-2 outline-none' placeholder='Enter post description' required />
                <button type="submit" className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg'>Create</button>
            </form>
        </div>
    );
};

export default CreatePost;
