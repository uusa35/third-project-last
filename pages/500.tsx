import OffLineWidget from '@/widgets/OffLineWidget';
import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';

const Custom500: NextPage = () => {
  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget message={`500 - Server-side error occurred`} />
    </MainContentLayout>
  );
}
export default Custom500;