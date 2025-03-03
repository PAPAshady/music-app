import { cloneElement } from 'react';
import PropTypes from 'prop-types';

export default function FAQQuestion({ icon, question, answer, classNames }) {
  const styledIcon = cloneElement(icon, { size: '100%' });
  return (
    <div
      className={`flex flex-col items-center gap-2 text-center lg:items-start lg:gap-3 lg:text-start ${classNames}`}
    >
      <div className="text-primary-500 bg-primary-50 grid size-12 place-content-center rounded-full lg:size-16">
        <span className="size-6 lg:size-8">{styledIcon}</span>
      </div>
      <span className="font-semibold lg:text-xl">{question}</span>
      <p className="text-primary-100 text-sm lg:text-base">{answer}</p>
    </div>
  );
}

FAQQuestion.propTypes = {
  icon: PropTypes.element.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  classNames: PropTypes.string,
};
