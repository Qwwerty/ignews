import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import Post, { getStaticProps } from '../../pages/posts'

const posts = [
    { slug: 'Post slug', title: 'Post title', excerpt: 'Post excerpt', updatedAt: 'Post updated' }
]

describe('Post page', () => {
    it('render correctly', () => {
        render(<Post posts={posts}/>)

        expect(screen.getByText('Post title')).toBeInTheDocument()
    })
})