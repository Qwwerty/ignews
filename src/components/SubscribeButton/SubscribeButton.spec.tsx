import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/client'
import { SubscribeButton } from '.'

jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<SubscribeButton />)

        expect(screen.getByText('Subscribe now')).toBeInTheDocument()
    })

    it('redirects user to sign in when not authenticated', () => {
        const useSessionMocked = mocked(useSession)
        const SignInMocked = mocked(signIn)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe now')

        fireEvent.click(subscribeButton)

        expect(SignInMocked).toHaveBeenCalled()
    })

    it('redirects to posts when user already has a subscription', () => {
        const useSessionMocked = mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([{
            user: {
                name: 'John Doe',
                email: 'johndoe@test.com'
            },
            activeSubscription: 'fake-activeSubscription',
            expires: 'fake-expires'
        }, false])

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe now')

        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalled()
    })
})

