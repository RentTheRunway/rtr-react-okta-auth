import * as React from 'react';
import NavBar from '../components/NavBar';

interface Props {}

const ReadBlog = (props: Props) => {
  return (
    <>
      <NavBar />

      <div className="container">
        <div className="alert alert-primary my-4">Blog - Read only page</div>
        <h1>Blog Title</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, cum
          quam! Laudantium expedita alias dignissimos facilis harum. Eaque quos
          expedita, blanditiis aperiam, non temporibus doloribus numquam nemo
          neque laboriosam labore.
        </p>
      </div>
    </>
  );
};

export default ReadBlog;
