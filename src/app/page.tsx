import CardForm from '@/components/CardForm'
import Image from 'next/image'
import bg from '../../public/wave2bg.png'
export default function Home() {
  return (
    <main className="h-full w-full flex flex-col items-center justify-center relative">
      <Image src={bg} alt="background" fill={true} className='-z-10' unoptimized={true}/>
      <CardForm />
    </main>
  )
}
