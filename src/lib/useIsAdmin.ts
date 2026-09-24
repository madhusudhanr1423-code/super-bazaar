import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth'

// Returns null while checking, then true or false
export function useIsAdmin() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (loading) return

    if (!user) {
      setIsAdmin(false)
      return
    }

    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data))
  }, [user, loading])

  return isAdmin
}