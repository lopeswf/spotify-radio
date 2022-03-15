import { jest, expect, describe, test, beforeEach} from '@jest/globals'
import { Service } from '../../../api/services/index.js'
import TestUtil from '../_util/testUtil';
import fsPromises from 'fs/promises'
import fs, { read } from 'fs'
import { join } from 'path'
import config from '../../../api/config/index.js';

const service = new Service()
const {
    dir: {
        publicDirectory
    }
} = config

describe('#Service - test suit for service', () => {
    const MOCK_FILE_INFO = {
        '/path/to/file2.txt': 'file2 contents',
    };
    beforeEach(()=>{
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    test('getFileInfo - given a file should return type and name', async () => {
        
        const filename = '/arquivo'
        const filetype = '.ext'
        const fullFilePath = join(publicDirectory, filename+filetype)

        jest.spyOn(
            fsPromises,
            fsPromises.access.name
        ).mockResolvedValue()

        const result = await service.getFileInfo(filename+filetype)

        expect(fsPromises.access).toBeCalledWith(fullFilePath)
        expect(result).toStrictEqual({
            type: filetype,
            name: fullFilePath
        })
    })
    test('getFileStream - given a filename should return a file stream', async () => {
        const filename = '/arquivo'
        const filetype = '.ext'
        const fullFilePath = join(publicDirectory, filename+filetype)
        const readableStream = await TestUtil.generateReadableStream(['data'])

        jest.spyOn(
            fsPromises,
            fsPromises.access.name
        ).mockResolvedValue()

        jest.spyOn(
            fs,
            fs.createReadStream.name
        ).mockReturnValue(readableStream)

        const result = await service.getFileStream(filename+filetype)

        expect(fs.createReadStream).toBeCalledWith(fullFilePath)
        expect(result).toStrictEqual({
            type: filetype,
            stream: readableStream
        })
    })
})