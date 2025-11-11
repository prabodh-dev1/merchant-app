import { supabase } from './supabase';
import { generateRewardCode, generateRandomCode } from './utils';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // 1. Create Tenants
    const { data: tenant1 } = await supabase
      .from('tenants')
      .insert({
        name: 'BluBoy India',
        code: 'BLUIND',
        status: 'ACTIVE',
      })
      .select()
      .single();

    const { data: tenant2 } = await supabase
      .from('tenants')
      .insert({
        name: 'BluBoy International',
        code: 'BLUINTL',
        status: 'ACTIVE',
      })
      .select()
      .single();

    console.log('✅ Created tenants');

    // 2. Create Merchants
    const { data: merchant1 } = await supabase
      .from('merchants')
      .insert({
        name: 'Cafe Coffee Day',
        code: 'CCD',
        tenant_id: tenant1!.id,
        status: 'ACTIVE',
      })
      .select()
      .single();

    const { data: merchant2 } = await supabase
      .from('merchants')
      .insert({
        name: 'Pizza Hut',
        code: 'PHT',
        tenant_id: tenant1!.id,
        status: 'ACTIVE',
      })
      .select()
      .single();

    const { data: merchant3 } = await supabase
      .from('merchants')
      .insert({
        name: 'Starbucks',
        code: 'SBX',
        tenant_id: tenant2!.id,
        status: 'ACTIVE',
      })
      .select()
      .single();

    console.log('✅ Created merchants');

    // 3. Create Users
    const { data: superAdmin } = await supabase
      .from('users')
      .insert({
        firebase_uid: 'super-admin-uid',
        email: 'admin@bluboy.com',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      })
      .select()
      .single();

    const { data: marketingAdmin } = await supabase
      .from('users')
      .insert({
        firebase_uid: 'marketing-admin-uid',
        email: 'marketing@bluboy.com',
        name: 'Marketing Admin',
        role: 'TENANT_MARKETING_ADMIN',
        status: 'ACTIVE',
      })
      .select()
      .single();

    const { data: merchantAdmin } = await supabase
      .from('users')
      .insert({
        firebase_uid: 'merchant-admin-uid',
        email: 'merchant@ccd.com',
        name: 'CCD Admin',
        role: 'MERCHANT_ADMIN',
        status: 'ACTIVE',
      })
      .select()
      .single();

    console.log('✅ Created users');

    // 4. Create Tenant Assignment
    await supabase.from('tenant_assignments').insert({
      user_id: marketingAdmin!.id,
      tenant_id: tenant1!.id,
      assigned_by: superAdmin!.id,
    });

    console.log('✅ Created tenant assignments');

    // 5. Create Merchant Assignment
    await supabase.from('merchant_assignments').insert({
      user_id: merchantAdmin!.id,
      merchant_id: merchant1!.id,
      assigned_by: superAdmin!.id,
    });

    console.log('✅ Created merchant assignments');

    // 6. Create Marketing Events
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 60);

    const { data: event1 } = await supabase
      .from('marketing_events')
      .insert({
        name: 'Summer Rewards 2024',
        tenant_id: tenant1!.id,
        merchant_id: merchant1!.id,
        min_reward_value: 10,
        max_reward_value: 500,
        total_rewards: 100,
        allow_dummy_rewards: true,
        allow_multiple_rewards_per_customer: false,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'ACTIVE',
        created_by: marketingAdmin!.id,
      })
      .select()
      .single();

    console.log('✅ Created marketing event');

    // 7. Create Rewards
    const rewards = [];
    for (let i = 0; i < 50; i++) {
      const codePart1 = generateRewardCode('CCD', 5);
      const codePart2 = generateRandomCode(8);
      const fullCode = `${codePart1}-${codePart2}`;

      const statuses = ['AVAILABLE', 'DISTRIBUTED', 'CLAIMED'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const reward: any = {
        code_part1: codePart1,
        code_part2: codePart2,
        full_code: fullCode,
        event_id: event1!.id,
        merchant_id: merchant1!.id,
        reward_value: Math.floor(Math.random() * 490) + 10,
        status,
        is_dummy: i < 5,
      };

      if (status === 'DISTRIBUTED' || status === 'CLAIMED') {
        const distributedDate = new Date();
        distributedDate.setDate(distributedDate.getDate() - Math.floor(Math.random() * 20));
        reward.distributed_at = distributedDate.toISOString();
        reward.customer_id = `CUST${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`;
      }

      if (status === 'CLAIMED') {
        const claimedDate = new Date();
        claimedDate.setDate(claimedDate.getDate() - Math.floor(Math.random() * 10));
        reward.claimed_at = claimedDate.toISOString();
      }

      rewards.push(reward);
    }

    await supabase.from('rewards').insert(rewards);

    console.log('✅ Created rewards');
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📧 Test Credentials:');
    console.log('Super Admin: admin@bluboy.com / password123');
    console.log('Marketing Admin: marketing@bluboy.com / password123');
    console.log('Merchant Admin: merchant@ccd.com / password123');

    return { success: true };
  } catch (error) {
    console.error('❌ Seed error:', error);
    return { success: false, error };
  }
}
