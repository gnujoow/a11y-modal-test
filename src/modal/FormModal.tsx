import { useSetAtom } from 'jotai';
import { useId, useRef, useState } from 'react';
import { openModalTypeAtom } from '../atoms/modalAtom';
import type { FormData } from '../api/modalApi';

interface FormErrors {
  name?: string;
  email?: string;
}

const FormModal = () => {
  const setOpenModalType = useSetAtom(openModalTypeAtom);
  const nameId = useId();
  const emailId = useId();
  const modalTitleId = useId();
  const errorMessageId = useId();
  const nameErrorId = useId();
  const emailErrorId = useId();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    // 이름 필드 검증
    if (!name || name.trim().length === 0) {
      errors.name = '이름을 입력해주세요.';
    }

    // 이메일 필드 검증
    if (!email || email.trim().length === 0) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 유효성 검사 통과 시
    setErrors({});
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    console.log('제출되었습니다:', { name, email });

    // Custom event로 결과 전달
    const event = new CustomEvent<FormData>('modal-form-result', {
      detail: { name, email }
    });
    document.dispatchEvent(event);

    setOpenModalType(null);
  };

  const handleClickCancel = () => {
    console.log('취소되었습니다.');
    setErrors({});

    // Custom event로 취소 전달
    const event = new CustomEvent<null>('modal-form-result', {
      detail: null
    });
    document.dispatchEvent(event);

    setOpenModalType(null);
  };

  const handleInputChange = (field: keyof FormErrors) => {
    // 입력 시 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

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
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? nameErrorId : undefined}
          style={{
            border: errors.name ? '1px solid red' : undefined
          }}
          onChange={() => handleInputChange('name')}
        />

        <label htmlFor={emailId}>이메일</label>
        <input
          type="email"
          id={emailId}
          name="email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? emailErrorId : undefined}
          style={{
            border: errors.email ? '1px solid red' : undefined
          }}
          onChange={() => handleInputChange('email')}
        />

        {hasErrors && (
          <div
            id={errorMessageId}
            role="alert"
            aria-live="polite"
            style={{ color: 'red', marginBottom: '16px' }}
          >
            {errors.name && <div id={nameErrorId}>{errors.name}</div>}
            {errors.email && <div id={emailErrorId}>{errors.email}</div>}
          </div>
        )}

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
