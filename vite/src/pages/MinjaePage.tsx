import { FC } from 'react';
import { OutletContext } from '../components/Layout';
import { useOutletContext } from 'react-router-dom';

const MinjaePage: FC = () => {
  
  const { signer } = useOutletContext<OutletContext>();

  return (
    <div className="min-h-screen bg-toss-light flex flex-col font-sans">

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-contain bg-center bg-no-repeat text-black py-24 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold leading-tight p-10">사용하지 못하는 잔돈을 이웃에게</h2>
            <p className="mt-4 text-lg">지금 바로 기부하세요</p>
            <button className="mt-8 bg-white text-toss-blue py-3 px-6 rounded-full font-bold">잔돈 조회하기</button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-toss-dark text-center">Features</h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-toss-light rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                <p>Make payments with confidence using our secure platform.</p>
              </div>
              <div className="p-6 bg-toss-light rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">Invest Easily</h3>
                <p>Grow your wealth with our easy-to-use investment tools.</p>
              </div>
              <div className="p-6 bg-toss-light rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">Track Expenses</h3>
                <p>Keep track of your spending and stay on budget.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-toss-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-toss-dark text-center">About Toss</h2>
            <p className="mt-6 text-lg text-center text-toss-dark">
              Toss is a leading fintech company focused on delivering a seamless financial experience.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MinjaePage;
