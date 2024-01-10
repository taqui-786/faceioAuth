import CardForm from '@/components/FaceioCardForm'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function Home() {
  return (
    
      <div className="p-4">
        <h1 className="text-7xl font-medium text-center mb-3">PixLab Demos</h1>
        <div className="flex gap-3 items-center justify-center">
        <Link href={'/faceioauth'} className={cn(buttonVariants({variant:'default'}))}>FACIO Authentication Demo</Link>
        <Link href={'/faceblur'} className={cn(buttonVariants({variant:'default'}))}>Blur Human Faces Demo</Link>
        <Link href={'/'} className={cn(buttonVariants({variant:'default'}))}>Filter image upload Demo</Link>
        </div>
      </div>
  )
}
