import type { CustomDecorator } from '@nestjs/common';

import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_AUTH_KEY = 'isSkipAuth';

export const SkipAuth = (): CustomDecorator<string> => SetMetadata(IS_SKIP_AUTH_KEY, true);
