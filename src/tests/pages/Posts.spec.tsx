import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismic'

import Post, { getStaticProps } from '../../pages/posts'

jest.mock('../../services/prismic')

const posts = [
    { slug: 'Post slug', title: 'Post title', excerpt: 'Post excerpt', updatedAt: 'Post updated' }
]

describe('Posts page', () => {
    it('render correctly', () => {
        render(<Post posts={posts}/>)

        expect(screen.getByText('Post title')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const getPrimisClientMocked = mocked(getPrismicClient)

        getPrimisClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'Post title' }
                            ],
                            content: [
                                { type: 'paragraph', text: 'Post excerpt' }
                            ]
                        },
                        last_publication_date: '04-01-2021'
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'Post title',
                        excerpt: 'Post excerpt',
                        updatedAt: '01 de abril de 2021'
                    }]
                }
            })
        )
    })
})