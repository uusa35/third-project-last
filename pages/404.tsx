import OffLineWidget from '@/widgets/OffLineWidget';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import error404 from '@/appImages/404_error.png';
import { NextPage } from 'next';

const Custom404: NextPage = () => {
  const { t } = useTranslation();
  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget img={`${error404.src}`} message={`not_found`} />
    </MainContentLayout>
  );
}
export default Custom404;
