import React from 'react';
import { CreateAdForm } from '../../components/create-ad/CreateAdForm';
import '../../sass/blocks/create-ad-page/create-ad-page.scss';

export const CreateAdPage: React.FC = () => {
  return (
    <div className="create-ad-page">
      <div className="container">
        <CreateAdForm />
      </div>
    </div>
  );
};

