import { ChangeEvent, FormEvent, useState } from 'react'
import { contactSectionModel } from './model'
import { Field, Form, Message, Section, SectionImg, Title } from './styles'
import ishowspeed from '@/assets/ishowspeed.jpg'
import { MdOutlineArrowForwardIos } from 'react-icons/md'
import { Button } from '../ui/Button'

export const ContactSectionView = ({}: ReturnType<
  typeof contactSectionModel
>) => {
  interface ContactData {
    name: string
    email: string
    message: string
  }
  const [error, setError] = useState<string>('')
  const initialState: ContactData = { name: '', email: '', message: '' }
  const [formData, setFormData] = useState<ContactData>(initialState)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required')
      return
    }
    if (!validateEmail(formData.email)) {
      setError('Invalidate email address')
      return
    }
    console.log('Form submited: ', formData)
    alert('Message sent!')
    setFormData(initialState)
  }

  return (
    <Section id='contact'>
      <Form onSubmit={handleSubmit}>
        <Title>Get in touch</Title>
        <Field
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          placeholder='Your name'
        />
        <Field
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
          placeholder='Your email'
        />
        <Message
          name='message'
          value={formData.message}
          onChange={handleChange}
          // required
          placeholder='Your Message'
        />
        {error && <p className='error'>{error}</p>}
        <Button type='submit'>
          Send <MdOutlineArrowForwardIos />
        </Button>
      </Form>
      <SectionImg
        src={ishowspeed}
        alt='ishowspeed'
      />
    </Section>
  )
}
