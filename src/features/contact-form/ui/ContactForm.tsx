import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../../shared/ui/button'

const contactSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  company: z.string().min(2, 'Укажите компанию'),
  contact: z.string().min(3, 'Укажите email или Telegram'),
  message: z.string().min(12, 'Опишите задачу чуть подробнее'),
  budgetTimeline: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>

type SubmitState = 'idle' | 'success' | 'error'

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      company: '',
      contact: '',
      message: '',
      budgetTimeline: '',
    },
  })

  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  async function onSubmit(values: ContactFormValues) {
    setSubmitState('idle')
    await new Promise((resolve) => window.setTimeout(resolve, 80))

    const failureRequested = /fail/i.test(values.contact) || /ошибка/i.test(values.name)
    setSubmitState(failureRequested ? 'error' : 'success')
  }

  return (
    <form className="contact-form" aria-label="Форма заявки" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-grid">
        <Field label="Имя" error={errors.name?.message}>
          <input {...register('name')} autoComplete="name" />
        </Field>
        <Field label="Компания" error={errors.company?.message}>
          <input {...register('company')} autoComplete="organization" />
        </Field>
      </div>

      <Field label="Email или Telegram" error={errors.contact?.message}>
        <input {...register('contact')} autoComplete="email" />
      </Field>

      <Field label="Описание задачи" error={errors.message?.message}>
        <textarea {...register('message')} rows={5} />
      </Field>

      <Field label="Бюджет/срок опционально" error={errors.budgetTimeline?.message}>
        <input {...register('budgetTimeline')} />
      </Field>

      <Button variant="accent" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Готовим заявку' : 'Отправить заявку'}
      </Button>

      <p className="form-note">
        Demo-режим: данные не отправляются наружу. Реальный endpoint подключается позже.
      </p>

      <div className="form-status" aria-live="polite">
        {submitState === 'success' ? 'Заявка подготовлена. В реальной версии она уйдет в выбранный канал.' : null}
        {submitState === 'error' ? 'Демо-отправка не выполнена. Проверьте fallback-состояние формы.' : null}
      </div>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactElement }) {
  const id = label.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-')

  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? `${id}-error` : undefined,
      })}
      {error ? (
        <span className="field__error" id={`${id}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  )
}
