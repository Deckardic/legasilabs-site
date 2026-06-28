import { DecoderText } from '../decoder-text'

type SectionTitleProps = {
  id: string
  title: string
  intro?: string
}

export function SectionTitle({ id, title, intro }: SectionTitleProps) {
  const titleWords = title.split(' ')

  return (
    <div className="section-title" data-motion="title">
      <h2 id={id} aria-label={title}>
        {titleWords.map((word, index) => (
          <DecoderText
            key={`${word}-${index}`}
            text={word}
            index={index}
            decodeOnView
            testId="section-decoder-word"
            motion="section-title-word"
          />
        ))}
      </h2>
      {intro ? <p className="section-title__intro">{intro}</p> : null}
    </div>
  )
}
