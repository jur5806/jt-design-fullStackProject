import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import userMock from './user'
import blogMock from './blog'
import showcaseMock from './showcase'
import toolsMock from './tools'
import interactionMock from './interaction'

export function setupProdMockServer() {
  createProdMockServer([
    ...userMock,
    ...blogMock,
    ...showcaseMock,
    ...toolsMock,
    ...interactionMock
  ])
} 