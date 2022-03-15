import { jest, expect, describe, test, beforeEach} from '@jest/globals'
import { Controller } from '../../../api/controller/index.js'
import { Service } from '../../../api/services/index.js'
import TestUtil from '../_util/testUtil';

const controller = new Controller()

describe('#Controller - test suit for controller', () => {
    beforeEach(()=>{
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test('given a filename should return a file stream', async () => {
        const mockFileStream = TestUtil.generateReadableStream(['data'])
        const expectedType = '.txt'
        jest.spyOn(
            Service.prototype,
            Service.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        const result = await controller.getFileStream('/path/to/file2.txt')

        expect(Service.prototype.getFileStream).toBeCalled()
        expect(result).toStrictEqual({
            stream: mockFileStream,
            type: expectedType
        })
    })
})
