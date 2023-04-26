import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'src/i18n/config';
import type { NextWebVitalsMetric } from 'next/app';
import { Provider } from 'react-redux';
import { wrapper } from '@/redux//store';
import MainLayout from '@/components/layouts/MainLayout';
import { AppProps } from 'next/app';
import { FC, Suspense } from 'react';
import ErrorHandler from '@/components/ErrorBoundary';
import { ErrorBoundary } from 'react-error-boundary';

const App: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Suspense>
      <Provider store={store}>
        <ErrorBoundary FallbackComponent={ErrorHandler}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ErrorBoundary>
      </Provider>
    </Suspense>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // isLocal ? console.log('metric', metric) : null;
}

export default App;

