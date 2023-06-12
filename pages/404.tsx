import OffLineWidget from '@/widgets/OffLineWidget';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import error404 from '@/appImages/404_error.png';
import { NextPage } from 'next';
import React from 'react';

const Custom404: NextPage = (): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget img={`${error404.src}`} message={`not_found`} />
    </MainContentLayout>
  );
}
export default Custom404;
