/*
    Copyright 2021 Picovoice Inc.

    You may not use this file except in compliance with the license. A copy of the license is located in the "LICENSE"
    file accompanying this source.

    Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
    an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
    specific language governing permissions and limitations under the License.
*/

#ifndef PV_ST_F769_H
#define PV_ST_F769_H

#include "picovoice.h"

#define PV_BOARD_NAME "STM32F769I-DISCO"

pv_status_t pv_board_init(void);
pv_status_t pv_message_init(void);
const uint8_t *pv_get_uuid(void);
const uint32_t pv_get_uuid_size(void);
void pv_board_deinit(void);
void pv_message_deinit(void);


#endif // PV_ST_F769_H

