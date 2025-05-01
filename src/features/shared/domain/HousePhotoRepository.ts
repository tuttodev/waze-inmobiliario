import type {File} from '@/features/shared/domain/File'

export interface HousePhotoRepository {
    upload: (file: File) => Promise<{ path: string }>;
}
