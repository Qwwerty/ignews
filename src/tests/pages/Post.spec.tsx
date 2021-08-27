import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getSession } from 'next-auth/client'
import { getPrismicClient } from '../../services/prismic'


import Post, { getServerSideProps } from '../../pages/posts/[slug]'

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

const post = { slug: 'Post slug', title: 'Post title', content: 'Post content', updatedAt: 'Post updated' }

describe('Post page', () => {
    it('render correctly', () => {
        const { debug }  = render(<Post post={post} />)

        expect(screen.getByText('Post content')).toBeInTheDocument()
    })

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: {
                slug: 'Post slug'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'Post title' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post content' }
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'Post slug'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'Post slug',
                        title: 'Post title',
                        content: '<p>Post content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })
})