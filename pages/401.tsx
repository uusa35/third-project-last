import OffLineWidget from '@/widgets/OffLineWidget';
import { useTranslation } from 'react-i18next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import NoNetwork from '@/appImages/no_network.png';
import { colors } from '@mui/material';
import { suppressText } from '@/constants/*';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from '@/redux/hooks';
import ReloadIcon from '@/appIcons/reload.svg';

const Custom401: NextPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const Button = () => {
    return (
      <div className='pt-5 space-x-3'>
        <button
          onClick={() => window.location.reload()}
          className={`text-center text-md capitalize text-white px-12 py-2 rounded-full flex items-center`}
          suppressHydrationWarning={suppressText}
          style={{ backgroundColor: color }}
        >
          <ReloadIcon />
          <span className='px-1'>{t('try_again')}</span>
        </button>
      </div>
    );
  };
  return (
    <MainContentLayout backHome={true}>
      <OffLineWidget
        img={`${NoNetwork.src}`} 
        message={`ooops_no_internet_connection`}
        desc={`check_your_internet_connection_and_try_again`}
        buttons={<Button />}
      />
    </MainContentLayout>
  );
}
export default Custom401;
