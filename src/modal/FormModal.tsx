import { useSetAtom } from 'jotai';
import { useId, useRef } from 'react';
import { openModalTypeAtom } from '../atoms/modalAtom';

const FormModal = () => {
  const setOpenModalType = useSetAtom(openModalTypeAtom);
  const nameId = useId();
  const emailId = useId();
  const modalTitleId = useId();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');

    console.log('제출되었습니다:', { name, email });
    setOpenModalType(null);
  };

  const handleClickCancel = () => {
    console.log('취소되었습니다.');
    setOpenModalType(null);
  };

  return (
    <>
      <h2 id={modalTitleId} tabIndex={-1}>신청 폼</h2>
      <p>이름과 이메일을 입력해주세요.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor={nameId}>이름</label>
        <input
          type="text"
          id={nameId}
          name="name"
          ref={firstInputRef}
          required
        />
        <label htmlFor={emailId}>이메일</label>
        <input type="email" id={emailId} name="email" required />
        <div>
          <button type="button" onClick={handleClickCancel}>
            취소
          </button>
          <button type="submit">제출</button>
        </div>
      </form>
    </>
  );
};

export default FormModal;
