import * as React from 'react';
import NavBar from '../components/NavBar';

interface Props {}

const Home = (props: Props) => {
  return (
    <>
      <NavBar />
      <div className="container"></div>
    </>
  );
};

export default Home;
