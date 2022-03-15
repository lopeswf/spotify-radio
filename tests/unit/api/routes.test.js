import { jest, expect, describe, test, beforeEach} from '@jest/globals'
import config from '../../../api/config/index.js'
import { Controller } from '../../../api/controller/index.js';
import { handler } from '../../../api/routes/index.js'
import TestUtil from '../_util/testUtil.js';

const {
    pages,
    location,
    constants: {
        CONTENT_TYPE
    }
} = config;

describe('#Routes - test suit for api responses', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    });
    test('GET / - should redirect to home uri', async() => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/'
        await handler(...params.values())

        expect(params.response.writeHead).toBeCalledWith(
            302,
            {
                'Location': location.home
            }          
        )
        expect(params.response.end).toHaveBeenCalled()
    })
    test(`GET /home - should response with ${pages.homeHTML} file stream`, async() => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/home'

        const mockFileStream = TestUtil.generateReadableStream(['data'])
        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHTML)
        expect(mockFileStream.pipe).toBeCalledWith(params.response)
    })
    test(`GET /controller - should response with ${pages.controllerHTML} file stream`, async() => {
        const params = TestUtil.defaultHandlerParams()
        params.request.method = 'GET'
        params.request.url = '/controller'

        const mockFileStream = TestUtil.generateReadableStream(['data'])
        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.controllerHTML)
        expect(mockFileStream.pipe).toBeCalledWith(params.response)
    })
    test('GET /index.html - should response with file stream', async() => {
        const params = TestUtil.defaultHandlerParams()
        const expectedFileName = '/index.html'
        const expectedType = ".html"
        
        params.request.method = 'GET'
        params.request.url = expectedFileName

        const mockFileStream = TestUtil.generateReadableStream(['data'])
        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(expectedFileName)
        expect(mockFileStream.pipe).toBeCalledWith(params.response)
        expect(params.response.writeHead).toHaveBeenCalledWith(
            200,
            {
                'Content-Type': CONTENT_TYPE[expectedType]
            }
        )
    })
    test('GET /file.ext - should response with file stream', async() => {
        const params = TestUtil.defaultHandlerParams()
        const expectedFileName = '/file.ext'
        const expectedType = ".ext"
        
        params.request.method = 'GET'
        params.request.url = expectedFileName

        const mockFileStream = TestUtil.generateReadableStream(['data'])
        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue()

        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(expectedFileName)
        expect(mockFileStream.pipe).toBeCalledWith(params.response)
        expect(params.response.writeHead).not.toHaveBeenCalledWith(
            200,
            {
                'Content-Type': CONTENT_TYPE[expectedType]
            }
        )
    })
    test('POST /unknown - given an inexistent route should response with 404', async() => {
        const params = TestUtil.defaultHandlerParams()
        
        params.request.method = 'POST'
        params.request.url = '/unknown'

        await handler(...params.values())

        expect(params.response.writeHead).toHaveBeenCalledWith(404)
        expect(params.response.end).toHaveBeenCalled()
    })

    describe('exceptions', () => {
        test('given inexistent file it should respond with 404', async() => {
            const params = TestUtil.defaultHandlerParams()
            
            params.request.method = 'GET'
            params.request.url = '/index.png'

            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error('Error: ENOENT'))
    
            await handler(...params.values())
    
            expect(params.response.writeHead).toHaveBeenCalledWith(404)
            expect(params.response.end).toHaveBeenCalled()
        })
        test('given an error it should respond with 500', async() => {
            const params = TestUtil.defaultHandlerParams()
            
            params.request.method = 'GET'
            params.request.url = '/unknown'
    
            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error('Error'))

            await handler(...params.values())
    
            expect(params.response.writeHead).toHaveBeenCalledWith(500)
            expect(params.response.end).toHaveBeenCalled()
        })
    })
})